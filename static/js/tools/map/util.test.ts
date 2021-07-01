import { ContextType } from "./context";
/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  updateHashPlaceInfo,
  updateHashStatVar,
  applyHashPlaceInfo,
  applyHashStatVar,
} from "./util";

const TestContext = ({
  placeInfo: {
    value: {
      selectedPlace: {
        dcid: "geoId/10",
        name: "Delaware",
        types: ["State"],
      },
      enclosingPlace: {
        dcid: "",
        name: "",
      },
      enclosedPlaceType: "County",
      enclosedPlaces: [
        {
          dcid: "geoId/10003",
          name: "a county",
        },
        {
          dcid: "geoId/10005",
          name: "another county",
        },
      ],
    },
  },
  statVar: {
    value: {
      dcid: "Count_Person",
      perCapita: false,
      info: null,
    },
  },
} as unknown) as ContextType;

test("updateHashPlaceInfo", () => {
  history.pushState = jest.fn();
  const resultHash = updateHashPlaceInfo("", TestContext.placeInfo.value);
  const expectedHash = "&pd=geoId/10&pn=Delaware&pt=State&ept=County";
  expect(resultHash).toEqual(expectedHash);
});

test("updateHashStatVarInfo", () => {
  history.pushState = jest.fn();
  const resultHash = updateHashStatVar("", TestContext.statVar.value);
  const expectedHash = "&sv=Count_Person&pc=0";
  expect(resultHash).toEqual(expectedHash);
});

test("applyHashPlaceInfo", () => {
  const context = { statVar: {}, placeInfo: {} } as ContextType;
  context.placeInfo.set = (value) => (context.placeInfo.value = value);
  const urlParams = new URLSearchParams(
    decodeURIComponent(
      "#%26sv%3DCount_Person%26svn%3DPeople%26pc%3D0%26pd%3DgeoId%2F10%26pn%3DDelaware%26pt%3DState&ept=County"
    ).replace("#", "?")
  );
  const placeInfo = applyHashPlaceInfo(urlParams);
  expect(placeInfo).toEqual({
    ...TestContext.placeInfo.value,
    enclosedPlaces: [],
    parentPlaces: null,
  });
});

test("applyHashStatVarInfo", () => {
  const context = { statVar: {}, placeInfo: {} } as ContextType;
  context.statVar.set = (value) => (context.statVar.value = value);
  const urlParams = new URLSearchParams(
    decodeURIComponent(
      "#%26sv%3DCount_Person%26svn%3DPeople%26pc%3D0%26pd%3DgeoId%2F10%26pn%3DDelaware%26pt%3DCounty"
    ).replace("#", "?")
  );
  const statVar = applyHashStatVar(urlParams);
  expect(statVar).toEqual(TestContext.statVar.value);
});