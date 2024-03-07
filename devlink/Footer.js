import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./Footer.module.css";

export function Footer({ as: _Component = _Builtin.Block }) {
  return (
    <_Component className={_utils.cx(_styles, "section")} tag="div">
      <_Builtin.Block className={_utils.cx(_styles, "container")} tag="div">
        <_Builtin.Block className={_utils.cx(_styles, "footer-wrap")} tag="div">
          <_Builtin.Link
            className={_utils.cx(_styles, "webflow-link")}
            button={false}
            block="inline"
            options={{
              href: "https://webflow.com/",
              target: "_blank",
            }}
          >
            <_Builtin.Block
              className={_utils.cx(_styles, "paragraph-tiny")}
              tag="div"
            >
              {"Powered by WealthComplAI"}
            </_Builtin.Block>
          </_Builtin.Link>
        </_Builtin.Block>
      </_Builtin.Block>
    </_Component>
  );
}
