FROM ubuntu:latest

RUN apt-get update && \
    apt-get install clang cmake git \
    ninja-build pkg-config libgtk-3-dev \
    liblzma-dev libstdc++-12-dev curl unzip zip -y

RUN curl -fsSL https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.29.0-stable.tar.xz -o flutter.tar.xz && \
    mkdir /opt/flutter && \
    tar -xf flutter.tar.xz -C /opt/flutter --strip-components=1 && \
    rm flutter.tar.xz

# Add Flutter to PATH
ENV PATH="/opt/flutter/bin:/opt/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Install Dart pub global activate
RUN /opt/flutter/bin/dart pub global activate flutter_distributor