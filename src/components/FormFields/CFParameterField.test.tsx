import React from "react";
import { render } from "@testing-library/react";

import { CfParameterField } from "./CfParameterField";

describe("CfParameterField", () => {
   test("renders the CfParameterField component", () => {
      render(<CfParameterField label="CF Parameter Input" />);
   });
});