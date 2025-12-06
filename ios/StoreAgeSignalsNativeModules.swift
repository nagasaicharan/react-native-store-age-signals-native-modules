import Foundation
import React
import StoreKit

#if canImport(DeclaredAgeRange)
import DeclaredAgeRange
#endif

// Check if DeclaredAgeRange type exists (iOS 18+) or handled via availability checks
// Removing generic canImport because it's part of StoreKit usually

@objc(StoreAgeSignalsNativeModulesSwift)
public class StoreAgeSignalsNativeModulesSwift: NSObject {

  @objc(multiply:withB:withResolver:withRejecter:)
  public func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    resolve(a*b)
  }
    
  @objc
  public func requestIOSDeclaredAgeRange(
    firstThresholdAge: NSNumber,
    secondThresholdAge: NSNumber,
    thirdThresholdAge: NSNumber,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
      // NOTE: Temporarily disabled due to API signature instability in current SDKs.
      // The framework DeclaredAgeRange exists, but the request types vary by beta version.
      // Re-enable when using a verified SDK with known signatures.
      #if false 
      if #available(iOS 18.0, *) {
          // ... implementation ...
          Task { @MainActor in
               // ...
          }
      } else {
         // ...
      }
      #else
      resolve([
          "status": nil,
          "parentControls": nil,
          "lowerBound": nil,
          "upperBound": nil
      ])
      #endif
  }
}
