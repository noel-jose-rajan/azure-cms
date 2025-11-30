import { ChangeEvent, Component, MouseEvent } from "react";
import Dynamsoft from "dwt";
import { getSelectEl } from "./tools/common";
import { DwtUIOperations } from "./tools/dwtUIOperations";

export default class DWTScan extends Component<{ dwtUtil: DwtUIOperations }> {
  state: {
    IfShowUI: boolean;
    IfFeederEnabled: boolean;
    IfAutoDiscardBlankpages: boolean;
    IfDuplexEnabled: boolean;
    PixelType: string;
    Resolution: string;
  };

  constructor(props: { dwtUtil: DwtUIOperations }) {
    super(props);
    this.state = {
      IfShowUI: false,
      IfFeederEnabled: true,
      IfAutoDiscardBlankpages: false,
      IfDuplexEnabled: false,
      PixelType: "1",
      Resolution: "200",
    };
  }

  setIfShowUI(value: boolean) {
    this.state.IfShowUI = value;
    this.setState(this.state);
  }
  setIfFeederEnabled(value: boolean) {
    this.state.IfFeederEnabled = value;
    this.setState(this.state);
  }
  setIfAutoDiscardBlankpages(value: boolean) {
    this.state.IfAutoDiscardBlankpages = value;
    this.setState(this.state);
  }
  setIfDuplexEnabled(value: boolean) {
    this.state.IfDuplexEnabled = value;
    this.setState(this.state);
  }
  setPixelType(value: string | number) {
    this.state.PixelType = `${value}`;
    this.setState(this.state);
  }
  setResolution(value: string) {
    this.state.Resolution = value;
    this.setState(this.state);
  }

  onSourceChange(event: ChangeEvent<HTMLSelectElement>) {
    let sourceEl = event.target;
    this.props.dwtUtil.handleDeviceChanged(sourceEl.value);
  }

  acquireImage(_event: MouseEvent<HTMLInputElement, MouseEvent>) {
    let sourceEl = getSelectEl("source");
    this.props.dwtUtil.acquireImage(sourceEl?.value, this.state);
  }

  loadImagesOrPDFs() { // _event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
    this.props.dwtUtil.loadImage();
  }

  handlePixelTypeChange(event: ChangeEvent<HTMLInputElement>) {
    let el = event.target;
    let bChecked = el.checked;
    if (bChecked) {
      //@ts-ignore
      let nPixelType = parseInt(el.getAttribute("data-value"));
      this.setPixelType(nPixelType);
    }
  }

  handleCheckBoxChange(
    event: ChangeEvent<HTMLInputElement>,
    checkBoxName: string
  ) {
    let bChecked = event.target.checked;
    switch (checkBoxName) {
      case "IfShowUI":
        this.setIfShowUI(bChecked);
        break;
      case "IfFeederEnabled":
        this.setIfFeederEnabled(bChecked);
        break;
      case "IfAutoDiscardBlankpages":
        this.setIfAutoDiscardBlankpages(bChecked);
        break;
      case "IfDuplexEnabled":
        this.setIfDuplexEnabled(bChecked);
        break;
    }
  }

  handleChangeResolution(event: ChangeEvent<HTMLSelectElement>) {
    this.setResolution(event.target.value);
  }

  render() {
    return (
      <>
        <div id="divScanner" className="divinput">
          <ul className="PCollapse">
            <li>
              <div className="divType">Custom Scan</div>
              <div id="div_ScanImage" className="divTableStyle">
                <ul id="ulScaneImageHIDE">
                  <li>
                    <label htmlFor="source">
                      <p>Select Source:</p>
                    </label>
                    <select
                      size={1}
                      id="source"
                      style={{ position: "relative" }}
                      onChange={(event) => this.onSourceChange(event)}
                    ></select>
                  </li>
                  <li id="divProductDetail">
                    <ul id="divTwainType">
                      <li>
                        <label
                          style={{ width: "165px" }}
                          id="lblShowUI"
                          htmlFor="showUI"
                        >
                          <input
                            type="checkbox"
                            id="showUI"
                            checked={this.state.IfShowUI}
                            onChange={(event) =>
                              this.handleCheckBoxChange(event, "IfShowUI")
                            }
                          />
                          Show Scanner UI&nbsp;
                        </label>

                        <label htmlFor="pageFeeder">
                          <input
                            type="checkbox"
                            id="pageFeeder"
                            checked={this.state.IfFeederEnabled}
                            onChange={(event) =>
                              this.handleCheckBoxChange(
                                event,
                                "IfFeederEnabled"
                              )
                            }
                          />
                          Use ADF&nbsp;
                        </label>
                      </li>
                      <li>
                        <label
                          style={{ width: "165px" }}
                          htmlFor="DiscardBlankPage"
                        >
                          <input
                            type="checkbox"
                            id="DiscardBlankPage"
                            checked={this.state.IfAutoDiscardBlankpages}
                            onChange={(event) =>
                              this.handleCheckBoxChange(
                                event,
                                "IfAutoDiscardBlankpages"
                              )
                            }
                          />
                          Auto Remove Blank Page
                        </label>
                        <label htmlFor="Duplex">
                          <input
                            type="checkbox"
                            id="Duplex"
                            checked={this.state.IfDuplexEnabled}
                            onChange={(event) =>
                              this.handleCheckBoxChange(
                                event,
                                "IfDuplexEnabled"
                              )
                            }
                          />
                          2-sided Scan
                        </label>
                      </li>
                      <li>
                        Pixel Type:
                        <label
                          htmlFor="BW"
                          style={{ marginLeft: "5px" }}
                          className="lblPixelType"
                        >
                          <input
                            type="radio"
                            id="BW"
                            checked={
                              this.state.PixelType ==
                              Dynamsoft.DWT.EnumDWT_PixelType.TWPT_BW.toString()
                            }
                            data-value={Dynamsoft.DWT.EnumDWT_PixelType.TWPT_BW}
                            onChange={(event) =>
                              this.handlePixelTypeChange(event)
                            }
                          />
                          B&amp;W{" "}
                        </label>
                        <label htmlFor="Gray" className="lblPixelType">
                          <input
                            type="radio"
                            id="Gray"
                            checked={
                              this.state.PixelType ==
                              Dynamsoft.DWT.EnumDWT_PixelType.TWPT_GRAY.toString()
                            }
                            data-value={
                              Dynamsoft.DWT.EnumDWT_PixelType.TWPT_GRAY
                            }
                            onChange={(event) =>
                              this.handlePixelTypeChange(event)
                            }
                          />
                          Gray{" "}
                        </label>
                        <label htmlFor="RGB" className="lblPixelType">
                          <input
                            type="radio"
                            id="RGB"
                            checked={
                              this.state.PixelType ==
                              Dynamsoft.DWT.EnumDWT_PixelType.TWPT_RGB.toString()
                            }
                            data-value={
                              Dynamsoft.DWT.EnumDWT_PixelType.TWPT_RGB
                            }
                            onChange={(event) =>
                              this.handlePixelTypeChange(event)
                            }
                          />
                          Color
                        </label>
                      </li>
                      <li>
                        <span>Resolution:</span>
                        <select
                          className="custom-select w-50"
                          id="Resolution"
                          size={1}
                          value={this.state.Resolution}
                          onChange={(event) =>
                            this.handleChangeResolution(event)
                          }
                        >
                          <option value="100">100</option>
                          <option value="150">150</option>
                          <option value="200">200</option>
                          <option value="300">300</option>
                        </select>
                      </li>
                    </ul>
                  </li>
                  <li>
                    {/*@ts-ignore */}
                    {/* <Button type="primary" id="btnScan" onClick={(event) => this.acquireImage(event)}>Scan</Button> */}
                    &nbsp;
                    {/*@ts-ignore */}
                    {/* <Button type="link" id="btnLoad" onClick={(event) => this.loadImagesOrPDFs(event)}>Import Local Images</Button> */}
                    {/*@ts-ignore */}
                    <input
                      id="btnScan"
                      className="btnScanGray btnScanActive"
                      type="button"
                      value="Scan"
                      // @ts-ignore
                      onClick={(event) => this.acquireImage(event)}
                    />
                    <a
                      id="btnLoad"
                      className="btnLoadAndSave"
                      onClick={(_event) => this.loadImagesOrPDFs()}
                    >
                      Import Local Images &gt;
                    </a>
                  </li>
                </ul>
                <div id="divNoScanners" style={{ visibility: "hidden" }}>
                  <a href="#" className="ClosetblLoadImage">
                    <img
                      className="imgClose"
                      src="assets/Images/Close.png"
                      alt="Close tblLoadImage"
                    />
                  </a>
                  <img src="assets/Images/Warning.png" />
                  <span className="spanContent">
                    <p className="contentTitle">
                      No TWAIN compatible drivers detected
                    </p>
                    <p className="contentDetail">
                      You can Install a Virtual Scanner:
                    </p>
                    <p className="contentDetail">
                      <a
                        id="samplesource32bit"
                        href="https://download.dynamsoft.com/tool/twainds.win32.installer.2.1.3.msi"
                      >
                        32-bit Sample Source
                      </a>
                      <a
                        id="samplesource64bit"
                        style={{ display: "none" }}
                        href="https://download.dynamsoft.com/tool/twainds.win64.installer.2.1.3.msi"
                      >
                        {" "}
                        64 - bit Sample Source
                      </a>{" "}
                      from{" "}
                      <a target="_blank" href="http://www.twain.org">
                        TWG
                      </a>
                    </p>
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </>
    );
  }
}
