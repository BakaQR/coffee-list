use tauri::Manager;
use notify_rust::{Notification as DesktopNotification, Urgency};

mod tray;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// 持久化通知
#[tauri::command]
fn notify_sticky(
    app: tauri::AppHandle,
    title: String,
    body: String,
    sound: Option<String>,
) -> Result<(), String> {
    let mut notification = DesktopNotification::new();

    notification
        .summary(&title)
        .body(&body)
        // Windows 后端会把 Critical 映射成 toast 的 scenario="reminder"
        .urgency(Urgency::Critical)
        // reminder 必须至少有一个按钮，否则 Windows 当普通通知处理，几秒后收起
        .action("dismiss", "关闭");

    if let Some(sound) = sound.filter(|s| !s.is_empty()) {
        notification.sound_name(&sound);
    }

    #[cfg(windows)]
    {
        use std::path::MAIN_SEPARATOR as SEP;

        // 和官方插件保持一致：
        // 只有安装后的 exe 才设置 AppUserModelID；
        // 开发模式（target/debug、target/release）沿用 PowerShell 的 AUMID，
        // 否则通知可能因为 AUMID 没注册而根本不显示。
        let exe = tauri::utils::platform::current_exe().map_err(|e| e.to_string())?;
        let exe_dir = exe.parent().ok_or_else(|| "无法获取 exe 目录".to_string())?;
        let curr_dir = exe_dir.display().to_string();
        let is_dev = curr_dir.ends_with(format!("{SEP}target{SEP}debug").as_str())
            || curr_dir.ends_with(format!("{SEP}target{SEP}release").as_str());

        if !is_dev {
            notification.app_id(&app.config().identifier);
        }
    }

    notification.show().map_err(|e| e.to_string())?;
    Ok(())
}

// 开发环境不阻止大多数快捷键
#[cfg(debug_assertions)]
fn prevent_default() -> tauri::plugin::TauriPlugin<tauri::Wry> {
    use tauri_plugin_prevent_default::Flags;
    tauri_plugin_prevent_default::Builder::new()
        .with_flags(Flags::CONTEXT_MENU | Flags::PRINT | Flags::DOWNLOADS)
        .build()
}

// 生产环境阻止所有快捷键
#[cfg(not(debug_assertions))]
fn prevent_default() -> tauri::plugin::TauriPlugin<tauri::Wry> {
    use tauri_plugin_prevent_default::{Flags, PlatformOptions};
    tauri_plugin_prevent_default::Builder::new()
        .platform(
            PlatformOptions::new()
                // Whether general form information should be saved and autofilled.
                .general_autofill(true)
                // Whether password information should be autosaved.
                .password_autosave(false)
                // Whether browser-specific accelerator keys are enabled.
                .browser_accelerator_keys(false)
                // Whether the default context menus are shown in the webview.
                .default_context_menus(false)
                // Whether the webview renders the default JavaScript dialog box.
                .default_script_dialogs(false),
        )
        .with_flags(Flags::all())
        .build()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_cli::init())
        .plugin(tauri_plugin_autostart::Builder::new().args(["--autostart"]).build(),)
        .plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {
            let _ = _app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }))
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(prevent_default())
        .setup(|app| {
            tray::create_tray(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, notify_sticky])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
