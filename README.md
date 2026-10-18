# Songsterr Sidebar UI

A custom UserScript and Chrome Extension designed to overhaul the Songsterr interface

## Features

*   **Smart Floating Sidebar:** Replaces the native controls with a 2x grid layout. The sidebar auto-hides off-screen and only activates when the mouse is moved to the right edge of the screen.
*   **Collapsible Top Bar:** The native top navigation bar can be shown or hidden using the hamburger menu icon located in the sidebar.
*   **Smart YouTube Player:** The integrated YouTube video player can be hidden or shown whilst staying playing and auto-resizes based on the video's aspect ratio to remove black bars.

## Known Issues & Limitations

*   **Top Bar Behaviour:** The top bar and Songsterr logo don't look great initially and don't disappear when scrolling away from the top. The top bar must be toggled via the hamburger menu in the sidebar to function properly.
*   **Scroll to Top Button:** The native "scroll to top" button does not work.
*   **Tab/Sheet Panel Visual Glitch:** The tab/sheet music panel has a minor visual issue.
*   **Sidebar Badges:** Some badges on the sidebar buttons are oversized and low resolution.
*   **Niche Buttons:** I haven't fully tested the functionality of some of the less common buttons.
*   **Video Report Button:** The "Report Video" menu can get obstructed and may be unusable.
*   **Favourite/Edit Indicators:** The favourite and edit buttons don't change colour to indicate when they are active or selected.
*   **Edit Mode Layout (No Tint Feature):** If you don't have the screen tint feature, the sidebar layout becomes muddled when in edit mode. The undo and redo buttons are not on the same row.

## Updating
*   **Tampermonkey:** The script is set to auto-update via GitHub. You can also check for updates in the Tampermonkey dashboard.
*   **Chrome Extension:** Pull the latest changes to the `extension` folder locally, then click the refresh icon on the extension card in `chrome://extensions/`.
