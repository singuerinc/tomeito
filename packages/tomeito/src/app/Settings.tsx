import React from "react";
import styled from "styled-components";
import { Bell } from "../icons/Bell";
import { PathBack } from "../icons/PathBack";
import { Sun } from "../icons/Sun";
import { Sync } from "../icons/Sync";

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

const View = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5em;
  background-color: #fff;
  width: 23em;
  i {
    margin: 0 0.2em;
    color: white;
  }
`;
