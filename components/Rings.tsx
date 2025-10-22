import { Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

type RingItem = {
  progress: number; // 0..1
  colors: [string, string];
  label: string;
  valueText: string;
};

type RingsProps = {
  size?: number;
  stroke?: number; // base stroke used for inner; others offset slightly
  rings: [RingItem, RingItem, RingItem]; // [outer, middle, inner]
  activeIndex?: 0 | 1 | 2;
  onActiveChange?: (index: 0 | 1 | 2) => void;
  gap?: number; // visual gap between rings
  dimOpacity?: number; // opacity for non-active rings
};

export function Rings({
  size = 180,
  stroke = 14,
  rings,
  activeIndex = 0,
  onActiveChange,
  gap = 8,
  dimOpacity = 0.2,
}: RingsProps) {
  // Ensure enough padding so strokeLinecap rounds don't get clipped
  const padding = stroke + 4;
  const innerStroke = stroke;
  const middleStroke = stroke;
  const outerStroke = stroke;
  
  // Calculate radii from outside in, ensuring no clipping
  const outerRadius = (size / 2) - padding - (outerStroke / 2);
  const middleRadius = outerRadius - (outerStroke / 2) - gap - (middleStroke / 2);
  const innerRadius = middleRadius - (middleStroke / 2) - gap - (innerStroke / 2);

  const circumference = (r: number) => 2 * Math.PI * r;
  const dash = (p: number, r: number) => circumference(r) * (1 - Math.max(0, Math.min(1, p)));
  const [outer, middle, inner] = rings;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="outer" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={outer.colors[0]} />
            <Stop offset="100%" stopColor={outer.colors[1]} />
          </LinearGradient>
          <LinearGradient id="middle" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={middle.colors[0]} />
            <Stop offset="100%" stopColor={middle.colors[1]} />
          </LinearGradient>
          <LinearGradient id="inner" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={inner.colors[0]} />
            <Stop offset="100%" stopColor={inner.colors[1]} />
          </LinearGradient>
        </Defs>
        {/* tracks */}
        <Circle cx={size / 2} cy={size / 2} r={outerRadius} stroke="#EEF2F7" strokeWidth={outerStroke} fill="none" />
        <Circle cx={size / 2} cy={size / 2} r={middleRadius} stroke="#F1F5F9" strokeWidth={middleStroke} fill="none" />
        <Circle cx={size / 2} cy={size / 2} r={innerRadius} stroke="#F3F4F6" strokeWidth={innerStroke} fill="none" />
        {/* rings */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={outerRadius}
          stroke="url(#outer)"
          strokeWidth={outerStroke}
          strokeDasharray={`${circumference(outerRadius)} ${circumference(outerRadius)}`}
          strokeDashoffset={dash(outer.progress, outerRadius)}
          strokeLinecap="round"
          opacity={activeIndex === 0 ? 1 : dimOpacity}
          fill="none"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
          onPress={() => onActiveChange?.(0)}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={middleRadius}
          stroke="url(#middle)"
          strokeWidth={middleStroke}
          strokeDasharray={`${circumference(middleRadius)} ${circumference(middleRadius)}`}
          strokeDashoffset={dash(middle.progress, middleRadius)}
          strokeLinecap="round"
          opacity={activeIndex === 1 ? 1 : dimOpacity}
          fill="none"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
          onPress={() => onActiveChange?.(1)}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          stroke="url(#inner)"
          strokeWidth={innerStroke}
          strokeDasharray={`${circumference(innerRadius)} ${circumference(innerRadius)}`}
          strokeDashoffset={dash(inner.progress, innerRadius)}
          strokeLinecap="round"
          opacity={activeIndex === 2 ? 1 : dimOpacity}
          fill="none"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
          onPress={() => onActiveChange?.(2)}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: 36, fontWeight: '700', color: '#0B0F14', fontFamily: 'system font' }}>
          {rings[activeIndex].valueText}
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', fontFamily: 'system font', marginTop: 4 }}>
          {rings[activeIndex].label}
        </Text>
      </View>
    </View>
  );
}


