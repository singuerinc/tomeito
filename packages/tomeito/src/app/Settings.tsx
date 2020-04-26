import React from "react";
import styled from "styled-components";
import { Bell } from "../icons/Bell";
import { PathBack } from "../icons/PathBack";
import { Sun } from "../icons/Sun";
import { Sync } from "../icons/Sync";

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
      <Sun />
      <Bell />
      <PathBack />
      <Sync />
    </View>
  );
}
