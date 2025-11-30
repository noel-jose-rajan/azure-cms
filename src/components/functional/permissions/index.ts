import { message } from "antd";
import {
  PermissionTypes,
  PermissionStatus,
} from "../../../constants/permissions";

export default class PermissionManager {
  static async getPermissionStatus(
    type: PermissionTypes
  ): Promise<PermissionStatus> {
    if (!navigator.permissions) return PermissionStatus.UNSUPPORTED;

    try {
      const status = await navigator.permissions.query({
        name: type as PermissionName,
      });

      if (status.state === "granted") {
        return PermissionStatus.GRANTED;
      } else if (status.state === "denied") {
        message.error(
          "'Microphone access has been denied. Please enable it from your browser settings.'"
        );
        return PermissionStatus.DENIED;
      } else {
        const response = await this.requestMediaPermission(type);
        return response;
      }
    } catch (error) {
      console.error(`Permission check failed for ${type}:`, error);
      return PermissionStatus.ERROR;
    }
  }

  static async requestMediaPermission(
    mediaType = PermissionTypes.CAMERA
  ): Promise<PermissionStatus> {
    try {
      const constraints =
        mediaType === PermissionTypes.MICROPHONE
          ? { audio: true }
          : mediaType === PermissionTypes.CAMERA
          ? { video: true }
          : { video: true, audio: true };

      await navigator.mediaDevices.getUserMedia(constraints);
      return PermissionStatus.GRANTED;
    } catch (err) {
      console.error(`${mediaType} permission denied or error:`, err);
      return PermissionStatus.DENIED;
    }
  }

  static async requestLocationPermission(): Promise<PermissionStatus> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported.");
        resolve(PermissionStatus.UNSUPPORTED);
      }

      navigator.geolocation.getCurrentPosition(
        () => resolve(PermissionStatus.GRANTED),
        (error) => {
          console.error("Geolocation error:", error);
          resolve(PermissionStatus.DENIED);
        }
      );
    });
  }

  static async askPermission(type: PermissionTypes): Promise<PermissionStatus> {
    const status = await this.getPermissionStatus(type);

    if (status === "granted") {
      return PermissionStatus.GRANTED;
    }

    switch (type) {
      case PermissionTypes.CAMERA:
      case PermissionTypes.MICROPHONE:
        return await this.requestMediaPermission(type);
      case PermissionTypes.GEOLOCATION:
        return await this.requestLocationPermission();
      default:
        console.warn(`Permission type '${type}' is not supported.`);
        return PermissionStatus.UNSUPPORTED;
    }
  }
}
