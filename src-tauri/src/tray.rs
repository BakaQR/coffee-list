use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, TrayIconBuilder, TrayIconEvent};
use tauri::Manager;

pub fn create_tray(app: &mut tauri::App) -> tauri::Result<()> {
    // 创建菜单
    let menu_show = MenuItem::with_id(app, "show", "显示", true, None::<&str>)?;
    let menu_quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;

    let menu = Menu::with_items(app, &[&menu_show, &menu_quit])?;

    let tray = TrayIconBuilder::with_id("main")
        .icon(app.default_window_icon().unwrap().clone())
        .tooltip("Coffee List")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "show" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.unminimize();
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            "quit" => {
                app.exit(0);
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            match event {
                TrayIconEvent::DoubleClick {
                    button: MouseButton::Left,
                    ..
                } => {
                    let app = tray.app_handle();
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.unminimize(); // 1. 解除最小化
                        let _ = window.show(); // 2. 确保可见
                        let _ = window.set_focus(); // 3. 置顶聚焦
                    }
                }
                _ => {}
            }
        })
        .build(app)?;

    tray.set_visible(false)?;
    Ok(())
}
