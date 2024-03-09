import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./ClassifyPage.module.css";

export function ClassifyPage({
  as: _Component = _Builtin.Block,
  confidenceRating = "waiting...",
  classification = "Loading...",
  rationaleForClassification = "...",
  rationaleForConfidenceRating = "...",
  additionalInformationRequired = "",
  userInputSection,
}) {
  return (
    <_Component className={_utils.cx(_styles, "div-block")} tag="div">
      <_Builtin.Section
        className={_utils.cx(_styles, "section-2")}
        grid={{
          type: "section",
        }}
        tag="section"
      >
        <_Builtin.Block
          className={_utils.cx(_styles, "text-block-3")}
          tag="div"
        >
          {"WealthComplAI"}
        </_Builtin.Block>
      </_Builtin.Section>
      <_Builtin.BlockContainer
        grid={{
          type: "container",
        }}
        tag="div"
      >
        <_Builtin.Heading tag="h1">
          <_Builtin.Strong className={_utils.cx(_styles, "bold-text")}>
            {"FATCA Classification"}
          </_Builtin.Strong>
        </_Builtin.Heading>
        <_Builtin.Layout
          className={_utils.cx(_styles, "quick-stack")}
          id={_utils.cx(
            _styles,
            "w-node-_95db12a6-2625-b19b-7ead-a9f68dc56931-8dc5692f"
          )}
        >
          <_Builtin.Cell
            id={_utils.cx(
              _styles,
              "w-node-_95db12a6-2625-b19b-7ead-a9f68dc56932-8dc5692f"
            )}
          >
            <_Builtin.Block
              className={_utils.cx(_styles, "text-block-4")}
              tag="div"
            >
              {"Classification"}
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "classification")}
              tag="div"
            >
              {classification}
            </_Builtin.Block>
          </_Builtin.Cell>
          <_Builtin.Cell
            className={_utils.cx(_styles, "cell")}
            id={_utils.cx(
              _styles,
              "w-node-_95db12a6-2625-b19b-7ead-a9f68dc56939-8dc5692f"
            )}
          >
            <_Builtin.Block
              className={_utils.cx(_styles, "text-block-4")}
              tag="div"
            >
              {"Rationale for Classification"}
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "classification-copy")}
              tag="div"
            >
              {rationaleForClassification}
            </_Builtin.Block>
          </_Builtin.Cell>
          <_Builtin.Cell
            id={_utils.cx(
              _styles,
              "w-node-_95db12a6-2625-b19b-7ead-a9f68dc56941-8dc5692f"
            )}
          >
            <_Builtin.Block
              className={_utils.cx(_styles, "text-block-4")}
              tag="div"
            >
              {"Confidence Rating"}
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "confidence-rating")}
              tag="div"
            >
              {confidenceRating}
            </_Builtin.Block>
          </_Builtin.Cell>
          <_Builtin.Cell
            id={_utils.cx(
              _styles,
              "w-node-_95db12a6-2625-b19b-7ead-a9f68dc56948-8dc5692f"
            )}
          >
            <_Builtin.Block
              className={_utils.cx(_styles, "text-block-4")}
              tag="div"
            >
              {"Rationale for Confidence Rating"}
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "confidence-rationale")}
              tag="div"
            >
              {rationaleForConfidenceRating}
            </_Builtin.Block>
          </_Builtin.Cell>
          <_Builtin.Cell
            id={_utils.cx(
              _styles,
              "w-node-_95db12a6-2625-b19b-7ead-a9f68dc5694f-8dc5692f"
            )}
          >
            <_Builtin.Block
              className={_utils.cx(_styles, "text-block-4")}
              tag="div"
            >
              {"Recommended Next Actions"}
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "text-block-2")}
              tag="div"
            >
              {additionalInformationRequired}
            </_Builtin.Block>
          </_Builtin.Cell>
        </_Builtin.Layout>
        <_Builtin.Block tag="div">{userInputSection}</_Builtin.Block>
      </_Builtin.BlockContainer>
    </_Component>
  );
}
