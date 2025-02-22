FROM ubuntu:latest  # Or a more specific base image if needed

# Install dependencies (including Flutter and anything your app needs)
RUN apt-get update && apt-get install -y \
    flutter \
    libgtk-3-0 \ # Example dependency - ADD YOUR ACTUAL DEPENDENCIES
libstdc++6 \ # Example dependency - ADD YOUR ACTUAL DEPENDENCIES
# ... other dependencies

# Set Flutter SDK path (adjust if necessary)
ENV PATH "$PATH:/usr/local/flutter/bin"

# Copy your application code
COPY . /app

# Set working directory
WORKDIR /app

# Get Flutter packages
RUN flutter pub get

# Build the Flutter app for Linux
RUN flutter build linux

# Create packaging directory (inside the container)
RUN mkdir -p packaging/DEBIAN packaging/usr/bin packaging/usr/lib/<your_app_name> packaging/usr/share/applications packaging/usr/share/icons/hicolor/scalable/apps

# Copy application files (adjust paths as needed)
RUN ARCH=$(uname -m)
RUN cp -r build/linux/$ARCH/<your_app_name> packaging/usr/lib/<your_app_name>
RUN cp build/linux/$ARCH/<your_app_name>/<your_app_name> packaging/usr/bin


# Create control file (inside the container)
RUN cat << EOF > packaging/DEBIAN/control
Package: <your_package_name>
Version: 1.0.0+${BUILD_NUMBER}
Architecture: $(uname -m)
Maintainer: Your Name <your.email@example.com>
Description: A brief description of your application.
Depends: libgtk-3-0, libstdc++6 # ADD YOUR ACTUAL DEPENDENCIES
Section: games
Priority: optional
EOF

# Create desktop entry (optional)
RUN cat << EOF > packaging/usr/share/applications/<your_app_name>.desktop
[Desktop Entry]
Name=<Your Application Name>
Comment=<A longer description>
Exec=/usr/bin/<your_app_name>
Icon=/<path/to/your/icon> # Add icon path
Terminal=false
Type=Application
Categories=Application;Utility;
EOF

# Build the .deb package (inside the container)
RUN dpkg-deb --build packaging <your_package_name>.deb

# Copy the .deb package to a persistent volume or a location accessible to Jenkins
COPY <your_package_name>.deb /output/<your_package_name>.deb # /output is a volume