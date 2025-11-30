import { ChangeEvent, Component, MouseEvent } from "react";
import Dynamsoft from "dwt";
import { getSelectEl } from "./tools/common";
import { DwtUIOperations } from "./tools/dwtUIOperations";

export default class DWTScan extends Component<{
  dwtUtil: DwtUIOperations;
  isEnglish?: boolean;
}> {
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

  loadImagesOrPDFs() {
    // _event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
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
              <div className={"divType " + (this.props.isEnglish ? "" : "ar")}>
                {this.props.isEnglish ? "Custom Scan" : "مسح مخصص"}
              </div>
              <div id="div_ScanImage" className="divTableStyle">
                <ul id="ulScaneImageHIDE">
                  <li>
                    <label
                      htmlFor="source"
                      className={this.props.isEnglish ? "" : "ar"}
                    >
                      <p>
                        {this.props.isEnglish
                          ? "Select Source:"
                          : "اختر المصدر:"}
                      </p>
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
                          className={this.props.isEnglish ? "" : "ar"}
                          // style={{ width: "165px" }}
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
                          {this.props.isEnglish
                            ? "Show Scanner UI"
                            : " إظهار واجهة الماسح الضوئي"}
                        </label>

                        <label
                          htmlFor="pageFeeder"
                          className={this.props.isEnglish ? "" : "ar"}
                        >
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
                          {this.props.isEnglish
                            ? "Use ADF"
                            : " استخدام ADF (وحدة تغذية المستندات التلقائية)"}
                        </label>

                        <label
                          htmlFor="DiscardBlankPage"
                          className={this.props.isEnglish ? "" : "ar"}
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
                          {this.props.isEnglish
                            ? "Auto Remove Blank Page"
                            : " إزالة الصفحات الفارغة تلقائيًا"}
                        </label>

                        <label
                          htmlFor="Duplex"
                          className={this.props.isEnglish ? "" : "ar"}
                        >
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
                          {this.props.isEnglish
                            ? "2-sided Scan"
                            : " المسح على الوجهين"}
                        </label>
                      </li>

                      <li
                        className={
                          this.props.isEnglish ? "" : "ar" + " pixel-type"
                        }
                      >
                        {this.props.isEnglish ? "Pixel Type:" : "نوع البكسل :"}

                        <label
                          htmlFor="BW"
                          // style={{ marginLeft: "5px" }}
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
                          {this.props.isEnglish ? "B&W" : "أبيض وأسود"}
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
                          <span>{this.props.isEnglish ? "Gray" : "رمادي"}</span>
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
                          {this.props.isEnglish ? "color " : "ملون"}
                        </label>
                      </li>
                      <li className={this.props.isEnglish ? "" : "ar"}>
                        <span>
                          {this.props.isEnglish ? "Resolution:" : " الدقة: "}
                        </span>
                        <select
                          name="Resolution"
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
                      value={this.props.isEnglish ? "Scan" : "مسح"}
                      // @ts-ignore
                      onClick={(event) => this.acquireImage(event)}
                    />
                    <a
                      id="btnLoad"
                      className="btnLoadAndSave"
                      onClick={(_event) => this.loadImagesOrPDFs()}
                    >
                      {this.props.isEnglish
                        ? "Import Local Images >"
                        : "استيراد الصور المحلية >"}
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
