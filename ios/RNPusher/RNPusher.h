//
//  RNPusher.h
//  RNPusher
//
//  Created by igor on 11/8/16.
//  Copyright © 2016 igor. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"
#import "RNPusherCore.h"

@interface RNPusher : NSObject <RCTBridgeModule, PTPusherDelegate>

@property (nonatomic, strong) PTPusher *pusher;

@end
