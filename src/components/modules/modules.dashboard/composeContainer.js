import React from "react";
import { Text, View } from "react-native";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function composeContainer(props) {
  return (
    <View style={props.stylesComposeContainer.container}>
      <Text style={props.stylesComposeContainer.title} > {props.title} </Text>
      <ResponsiveContainer>
        <ComposedChart
          width={props.width}
          height={props.height}
          data={props.data}
          margin={{
            top: props.top,
            right: props.right,
            bottom: props.bottom,
            left: props.left
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" scale="auto" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={props.dataKeyBar} barSize={props.barSize} fill="#413ea0" />
          <Line type="monotone" dataKey={props.dataKeyCurve} stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </View>
  );
}