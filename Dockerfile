FROM ubuntu:latest

RUN apt-get update && \
    apt-get install clang cmake git \
    ninja-build pkg-config libgtk-3-dev \
    liblzma-dev libstdc++-12-dev curl unzip zip xz-utils sudo -y

# Download Flutter SDK
RUN curl -fsSL https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.29.0-stable.tar.xz -o flutter.tar.xz

RUN mkdir /opt/flutter && \
    tar -xf flutter.tar.xz -C /opt/flutter --strip-components=1 && \
    rm flutter.tar.xz

# Add Flutter to PATH
ENV PATH="/opt/flutter/bin:/opt/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Configure Git to recognize the Flutter directory as safe
RUN git config --global --add safe.directory /opt/flutter

# Run flutter doctor
RUN flutter doctor

# Install Dart pub global activate
RUN flutter pub global activate flutter_distributor

CMD ["bash"]
