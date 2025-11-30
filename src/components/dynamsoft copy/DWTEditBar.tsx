
import { Component } from "react";

import { RemoveCurrentPageDialog } from "./tools/removeCurrentPageDialog"
import { RemoveAllPagesDialog } from "./tools/removeAllPagesDialog"
import { DwtUIOperations } from "./tools/dwtUIOperations";

export default class DWTEditBar extends Component<{dwtUtil:DwtUIOperations}> {

  dlgRemoveCurrent;
  dlgRemoveAll;

  constructor(props: { dwtUtil: any; }) {
    super(props);

    this.dlgRemoveCurrent = new RemoveCurrentPageDialog(props.dwtUtil);
    this.dlgRemoveAll = new RemoveAllPagesDialog(props.dwtUtil);
  }

  clickbtnZoomOut() {
    this.props.dwtUtil.onclickZoomOut();
  }
  clickbtnZoomIn() {
    this.props.dwtUtil.onclickZoomIn();
  }
  clickbtnOrigSize() {
    this.props.dwtUtil.onclickOrigSize();
  }
  clickbtnFitWindow() {
    this.props.dwtUtil.onclickFitWindow();
  }
  clickbtnRotateLeft() {
    this.props.dwtUtil.onclickRotateLeft();
  }
  clickbtnCrop() {
    this.props.dwtUtil.onclickCrop();
  }
  clickbtnShowImageEditor() {
    this.props.dwtUtil.onclickShowImageEditor();
  }
  clickbtnSelect() {
    this.props.dwtUtil.onclickSelect();
  }
  clickbtnHand() {
    this.props.dwtUtil.onclickHandButton();
  }

  clickbtnRemoveCurrentImage() {
    this.dlgRemoveCurrent.remove();
  }
  clickbtnRemoveAllImages() {
    this.dlgRemoveAll.removeAll();
  }

  render() {
  return (
    <>
      <div id="divEdit">
          <ul className="operateGrp">
            <li>
              <div className="menuIcon RemoveSelectedImages" style={{ marginLeft: "5px" }} title="Remove current page"
                id="DW_btnRemoveCurrentImage" onClick={() => this.clickbtnRemoveCurrentImage()} ></div>
            </li>
            <li>
              <div className="menuIcon RemoveAllImages" title="Remove all pages" id="DW_btnRemoveAllImages"
                onClick={() => this.clickbtnRemoveAllImages()}></div>
            </li>
            <li style={{ width:"90px" }} ></li>
            <li className="lblShowCurrentImage"><input type="text" size={2} id="DW_CurrentImage" readOnly={true} />/<input
                type="text" size={2} id="DW_TotalImage" readOnly={true} /></li>
            <li className="lblZoom">
              <ul>
                <li style={{ width:"25%" }}>
                  <div className="menuIcon ZoomOut" title="Zoom out" id="btnZoomOut" onClick={() => this.clickbtnZoomOut()}>
                  </div>
                </li>
                <li style={{ width:"50%" }}><input type="text" id="DW_spanZoom" readOnly={true} /></li>
                <li style={{ width:"25%" }}>
                  <div className="menuIcon ZoomIn" title="Zoom in" id="btnZoomIn" onClick={() => this.clickbtnZoomIn()}>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <div style={{ marginLeft: "10px" }} className="menuIcon OrigSize" title="1:1" id="btnOrigSize"
                onClick={() => this.clickbtnOrigSize()}></div>
              <div className="menuIcon FitWindow" title="Fit To Window" id="btnFitWindow" style={{ display:"none" }}
                onClick={() => this.clickbtnFitWindow()}></div>
            </li>
            <li style={{ width: "50px" }}></li>
            <li>
              <div className="menuIcon RotateLeft" title="Rotate left" id="btnRotateL"
                onClick={() => this.clickbtnRotateLeft()}></div>
            </li>
            <li>
              <div className="menuIcon grayimg Crop" title="Please select an area to crop." 
                id="btnCropGray"></div>
              <div className="menuIcon Crop" title="Crop" id="btnCrop" style={{ display:"none" }} onClick={() => this.clickbtnCrop()}>
              </div>
            </li>
            <li>
              <div className="menuIcon ShowEditor" title="Show image editor" id="btnShowImageEditor"
                onClick={() => this.clickbtnShowImageEditor()}></div>
            </li>
            <li style={{ marginTop: "0" }} >
              <div className="menuIcon SelectSelected" title="Select" id="btnSelect_selected"></div>
              <div className="menuIcon Select" style={{ display:"none" }} title="Select"id="btnSelect"
                onClick={() => this.clickbtnSelect()}></div>
            </li>
            <li style={{ marginTop: "0" }} >
              <div className="menuIcon HandSelected" style={{ display:"none" }} title="Hand" id="btnHand_selected">
              </div>
              <div className="menuIcon Hand" title="Hand" id="btnHand" onClick={() => this.clickbtnHand()}></div>
            </li>
          </ul>
        </div>
    </>
  );
  }
}
