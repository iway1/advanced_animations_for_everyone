import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Text, View } from "react-native";


const ENLARGE_SIZE_RATIO = 0.9;
const SPACING = 10;
const ENLARGE_DURATION = 2000;

// Calculating view positions

function calculateViewPosition(i, fcSize){
    const column = i % 2;
    const row = Math.floor(i / 2);
    const viewSize = (fcSize - SPACING) / 2;
    
    var x, y;
    if(column == 0)
        x = viewSize / 2;
    else
        x = viewSize * 3/2 + SPACING;
    if(row == 0)
        y = viewSize / 2;
    else
        y = viewSize * 3/2 + SPACING
    var start = {x, y};

    // Calculate Enlarged Position
    const enlargedSize = fcSize * ENLARGE_SIZE_RATIO;
    const shrunkSize = fcSize * (1 - ENLARGE_SIZE_RATIO) - SPACING
    if(column == 0) {
        x = enlargedSize / 2;
    } else {
        x = fcSize - enlargedSize / 2;
    }

    if(row == 0) {
        y = enlargedSize / 2;
    } else {
        y = fcSize - enlargedSize / 2;
    }

    var enlarged = {x, y};
    // Calculate Shrunk Position
    if(column == 0) {
        x = shrunkSize / 2;
    } else {
        x = fcSize - shrunkSize / 2;
    }
    if(row == 0) {
        y = shrunkSize / 2;
    } else {
        y = fcSize - shrunkSize / 2;
    }
    var shrunk = {x, y}
	console.log({start, enlarged, shrunk})
    return {start, enlarged, shrunk}
}

function EnlargeView({x, y, size, item, scale}) {
    const {imageSource, text} = item;
    return (
		<Animated.View style={{
			width: 0,
			height: 0,
			position: 'absolute',
			left: 0,
			top: 0,
			transform: [
				{translateX: x}, 
				{translateY: y},
				{scale}, 
				
			],
			
		}}>
            <View style={{
                position: 'absolute',
                left: -size / 2,
                top: -size / 2,
                width: size,
                height: size,
            }}>
                <Image 
					style={{
						width: size, height: size
					}} 
					source={imageSource}
				/>
                <View style={{
                    position: 'absolute',
                    width: size, 
                    height: size,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{fontSize: 36, color: 'white'}}>
						{text}
					</Text>
                </View>
            </View>
        </Animated.View>
    )
}

// Working;
export function FourCorners({items, selectedIndex, size}) {
	if(items.length != 4) throw "Four corners must have exactly 4 items."
    const [viewPositions] = useState(items.map((_, i)=>{return calculateViewPosition(i, size)}))
    const animatedScales = items.map((item)=>{
        return useRef(new Animated.Value(1.0)).current;
    })
    const animatedPositions = items.map((item, i)=>{
        return useRef(new Animated.ValueXY(viewPositions[i].start)).current;
    })

	const enlargeViewDefaultSize = (size - SPACING) / 2;
	const enlargeViewEnlargedSize = size*ENLARGE_SIZE_RATIO;
	const enlargeViewShrunkSize = size*(1 - ENLARGE_SIZE_RATIO) - SPACING;

	useEffect(()=>{
		if(selectedIndex == null)
			return;
		for(var i = 0; i < 4; i++ ){
			const newPosition = i==selectedIndex?viewPositions[i].enlarged:viewPositions[i].shrunk;
			const desiredSize = i==selectedIndex?enlargeViewEnlargedSize:enlargeViewShrunkSize;
			const newScale = desiredSize/enlargeViewDefaultSize;
				
			const positionAnimation = Animated.timing(animatedPositions[i],{
				toValue: newPosition,
				useNativeDriver: true,
				duration: ENLARGE_DURATION,
			})
			const scaleAnimation = Animated.timing(animatedScales[i], {
				toValue: newScale,
				useNativeDriver: true,
				duration: ENLARGE_DURATION,
			})
			Animated.parallel([positionAnimation, scaleAnimation]).start();
		}
	},[selectedIndex])
    
	return (
		<View style={{
			width: size,
			height: size,
			backgroundColor: 'black',
		}}>
			{
			items.map((item, i)=>{
				return (
					<EnlargeView
						x={animatedPositions[i].x}
						y={animatedPositions[i].y}
						scale={animatedScales[i]}
						size={enlargeViewDefaultSize}
						item={item}
						key={''+i}
					/>
				)
			})
			}
		</View>
	)
}

