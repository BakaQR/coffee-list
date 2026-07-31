use tauri::{Manager};

mod tray;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
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
        .plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {
            let _ = _app.get_webview_window("main")
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
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
