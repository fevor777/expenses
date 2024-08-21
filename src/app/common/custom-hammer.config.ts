import { Injectable } from "@angular/core";
import { HammerGestureConfig } from "@angular/platform-browser";

@Injectable()
export class CustomHammerConfig extends HammerGestureConfig {
  override = {
    swipe: { 
      direction: Hammer.DIRECTION_HORIZONTAL, 
      threshold: 10,  // Minimum distance in pixels for a swipe to be detected
      velocity: 0.3  // Minimum velocity in pixels per second for a swipe to be detected
    }
  };
}
