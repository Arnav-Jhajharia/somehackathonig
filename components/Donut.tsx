import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface DonutProps {
  size?: number;
  stroke?: number;
  progress: number; // 0 - 1
  color?: string;
  trackColor?: string;
  label?: string;
  valueText?: string;
}

export function Donut({
  size = 120,
  stroke = 12,
  progress,
  color = '#2563EB',
  trackColor = '#E5E7EB',
  label,
  valueText,
}: DonutProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(1, progress)));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        {!!valueText && <Text style={{ fontSize: 18, fontWeight: '700' }}>{valueText}</Text>}
        {!!label && <Text style={{ fontSize: 12, color: '#6B7280' }}>{label}</Text>}
      </View>
    </View>
  );
}


