# FixIt Flutter Application

This directory will house the cross-platform Flutter application code targeting iOS, Android, and Web.

## Future Initialization Setup

To initialize the Flutter codebase inside this folder:

1. **Prerequisites**: Install the Flutter SDK (version 3.19+ recommended) and configure your target platform toolchains (Android Studio, Xcode, and/or web browsers).
2. **Command**:
   ```bash
   flutter create --org com.fixit.app --project-name fixit_app ./
   ```
3. **Core Packages to Add**:
   - `supabase_flutter`: Database connection, authentication, and vector search queries.
   - `audioplayers` or `just_audio`: Audio caching and voice player playback.
   - `graphview`: Interactive concept mind-map visualizer.
   - `google_fonts`: Typographic controls for reading custom styles.
   - `flutter_riverpod` or `provider`: Application state management.

For details on the technical build pipeline, please refer to the main repository [README.md](file:///Users/prajein/Documents/Github/fixit/README.md).
