import React from "react";
import styled from "styled-components";
import { icons } from "feather-icons";

const View = styled.div`
  background-color: #444;
  width: 23em;
  svg {
    color: white;
  }
`;

export function Settings() {
  return (
    <View>
      <i dangerouslySetInnerHTML={{ __html: icons.sun.toSvg() }} />
      <i dangerouslySetInnerHTML={{ __html: icons.bell.toSvg() }} />
      <i dangerouslySetInnerHTML={{ __html: icons.layers.toSvg() }} />
      <i dangerouslySetInnerHTML={{ __html: icons["refresh-cw"].toSvg() }} />
    </View>
  );
}
