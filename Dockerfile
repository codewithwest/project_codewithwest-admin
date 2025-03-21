# Stage 1: Build Flutter Application
FROM ubuntu:latest AS builder

RUN apt-get update && apt-get install -y curl git unzip xz-utils sudo
# clang cmake git ninja-build pkg-config libgtk-3-dev \
# liblzma-dev libstdc++-12-dev curl unzip zip xz-utils sudo

# Download Flutter SDK
RUN curl -fsSL https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.29.0-stable.tar.xz -o flutter.tar.xz

RUN mkdir /opt/flutter && \
    tar -xf flutter.tar.xz -C /opt/flutter --strip-components=1 && \
    rm flutter.tar.xz

ENV PATH="/opt/flutter/bin:/opt/flutter/bin/cache/dart-sdk/bin:${PATH}"

RUN git config --global --add safe.directory /opt/flutter

RUN flutter doctor

RUN flutter pub global activate flutter_distributor

# Stage 2: Create the final, smaller image
FROM debian:12-slim

# Install necessary runtime dependencies and build tools.
RUN apt-get update && apt-get install \
    clang cmake git ninja-build pkg-config libgtk-3-dev \
    liblzma-dev libstdc++-12-dev curl unzip zip xz-utils sudo -y \
    && rm -rf /var/lib/apt/lists/*

# Copy the Flutter SDK from the builder stage
COPY --from=builder /opt/flutter /opt/flutter

ENV PATH="/opt/flutter/bin:/opt/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Set the working directory
WORKDIR /app

RUN git config --global --add safe.directory /opt/flutter

# Keep the container running
CMD ["tail", "-f", "/dev/null"]