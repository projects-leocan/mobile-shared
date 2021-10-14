//
//  RNLogger.m
//  RNLogger
//
//  Created by igor on 10/4/17.
//  Copyright © 2017 igor. All rights reserved.
//

#import "RNLogger.h"

@implementation RNLogger

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(log:(NSString *)info)
{
    NSLog(@"[RNLogger]: %@", info);
}

@end
