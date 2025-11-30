import { ChangeEvent, Component } from "react";

import { getEl, getInputEl } from "./tools/common";
import { DwtUIOperations } from "./tools/dwtUIOperations";
import { Button, Card, Col, message, Row } from "antd";
import { FileImageFilled, FilePdfFilled } from "@ant-design/icons";

export default class DWTUploadAndSave extends Component<{
  dwtUtil: DwtUIOperations;
  isEnglish?: boolean;
  onPdfGenerate?: (blob: Blob) => any;
  onTifGenerate?: (blob: Blob) => any;
  onImageGenerate?: (blob: Blob) => any;
}> {
  constructor(props: { dwtUtil: DwtUIOperations }) {
    super(props);
    this.state = {
      strFileNameWithoutExt: "WebTWAINImage",
      strExtension: "pdf",
      bAllPages: true,
      pagesCount: 0,
    };
  }

  state: {
    strFileNameWithoutExt: string;
    strExtension: string;
    bAllPages: boolean;
    pagesCount: number;
  };

  setFileNameWithoutExt(value: string) {
    this.state.strFileNameWithoutExt = value;
    this.setState(this.state);
  }
  setAllPages(value: boolean) {
    this.state.bAllPages = value;
    this.setState(this.state);
  }

  handleFileNameChange(evt: ChangeEvent<HTMLInputElement>) {
    let el = evt.target;
    this.setFileNameWithoutExt(el.value);
  }

  handleImageExtensionChange(evt: ChangeEvent<HTMLSelectElement>) {
    let el = evt.target;
    let strNewExtension = el.value;
    strNewExtension = strNewExtension.toLowerCase();
    this.state.strExtension = strNewExtension;

    let currentPage = getInputEl("CurrentPage");
    let allPages = getInputEl("AllPages");

    // set AllPages OR CurrentPage
    switch (strNewExtension) {
      case "pdf":
        this.state.bAllPages = true;
        break;
      case "tif":
      case "bmp":
      case "jpg":
      case "png":
        this.state.bAllPages = false;
        break;
      default:
        break;
    }
    this.setState(this.state);

    // set Enabled
    if (strNewExtension == "pdf" || strNewExtension == "tif") {
      if (currentPage) {
        currentPage.disabled = false;
      }

      if (allPages) {
        allPages.disabled = false;
      }
    } else {
      if (currentPage) {
        currentPage.disabled = true;
      }

      if (allPages) {
        allPages.disabled = true;
      }
    }
  }

  saveOrUploadImage(saveType: string) {
    let strAllPages = this.state.bAllPages.toString();
    console.log(strAllPages);

    this.props.dwtUtil.save(
      saveType,
      this.state.strFileNameWithoutExt,
      this.state.strExtension,
      strAllPages
    );
  }

  showCustomInfo() {
    let el = getEl("customDetail");
    if (el) el.style.display = "";
  }

  hideCustomInfo() {
    let el = getEl("customDetail");
    if (el) el.style.display = "none";
  }

  onclickShowUploadedFiles() {
    this.props.dwtUtil.onclickShowUploadedFiles();
  }

  onclickSaveDocuments() {
    this.props.dwtUtil.onclickSaveDocuments();
  }

  logFileAsBlob() {
    const fileName = `${this.state.strFileNameWithoutExt}.${this.state.strExtension}`;
    const fileContent = `Dummy content for ${fileName}`;
    const blob = new Blob([fileContent], { type: "text/plain" });
    console.log(blob);
  }

  async fetchAllImagesAsPdfBlob() {
    try {
      const blob = await this.props.dwtUtil.getPdfBlob();

      if (this.props.onPdfGenerate) {
        await this.props.onPdfGenerate(blob);
      }
      // const blobUrl = URL.createObjectURL(blob);
      // window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Error fetching PDF blob:", error);
    }
  }

  async fetchOneImagesBlob() {
    try {
      const imageIndex = this.props.dwtUtil.getCurrentImageIndex();

      console.log(imageIndex);

      if (typeof imageIndex === "undefined" || imageIndex < 0) {
        return message.error("No Image Selected");
      }
      const blob = await this.props.dwtUtil.getImageBlob(imageIndex);

      this.props.onImageGenerate && this.props.onImageGenerate(blob);

      // const blobUrl = URL.createObjectURL(blob);
      // window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Error fetching PDF blob:", error);
    }
  }

  async fetchAllImagesAsTiffBlob() {
    try {
      const blob = await this.props.dwtUtil.getTiffBlob();

      this.props.onTifGenerate && this.props.onTifGenerate(blob);

      // const blobUrl = URL.createObjectURL(blob);
      // window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Error fetching PDF blob:", error);
    }
  }

  render() {
    return (
      <>
        <div
          id="divUpload"
          className="divinput mt30"
          style={{ position: "relative" }}
        >
          <ul>
            <li>
              <div className={"divType " + (this.props.isEnglish ? "" : "ar")}>
                {this.props.isEnglish ? "Save Documents" : "حفظ المستندات"}{" "}
              </div>
            </li>
          </ul>
        </div>
        <div id="tabCon" className="divinput mt30">
          <div id="divSaveDetail">
            <ul>
              <Card>
                <Row gutter={20}>
                  <Col span={24}>
                    <Button
                      style={{ width: "100%" }}
                      id="btnFetchPdfBlob"
                      className="btnFetchPdfBlob"
                      onClick={() => this.fetchAllImagesAsPdfBlob()}
                    >
                      <FilePdfFilled />{" "}
                      {this.props.isEnglish ? "Save Document" : "حفظ المستند"}
                    </Button>
                  </Col>
                  {/* <Col span={8}>
                    <Button
                      style={{ width: "100%" }}
                      id="btnFetchPdfBlob"
                      className="btnFetchPdfBlob"
                      onClick={() => this.fetchOneImagesBlob()}
                    >
                      <FileImageFilled /> IMG
                    </Button>
                  </Col> */}
                  {/* <Col span={8}>
                    <Button
                      style={{ width: "100%" }}
                      id="btnFetchPdfBlob"
                      onClick={() => this.fetchAllImagesAsTiffBlob()}
                    >
                      <FileImageFilled /> TIF
                    </Button>
                  </Col> */}
                </Row>
              </Card>
            </ul>
          </div>
          <div id="divUploadedFiles" style={{ display: "none" }}>
            <div id="resultWrap"></div>
          </div>
        </div>
      </>
    );
  }
}
