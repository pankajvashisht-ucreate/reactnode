import React, { useState } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import PdfView from "../../components/common/PdfView";
import Audio from "../../components/common/Audio";
import Image from "../../components/common/Image";

const PostDetails = props => {
  const [postdetail] = useState({ ...props.location.state.postDetails });
  const dates = dates => {
    var date = new Date(dates * 1000);
    return (
      date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
  };
  const fileType = type => {
    const statusCheck = () => {
      return type !== 3
        ? type === 1
          ? "badge  badge-success"
          : "badge badge-info"
        : "badge badge-warning";
    };
    const text = () => {
      return type !== 3 ? (type === 1 ? "Pdf" : "Audio") : "Pdf/Audio";
    };
    return <span className={statusCheck()}>{text()}</span>;
  };
  const status = type => {
    const statusCheck = () => {
      return type === 1 ? "badge  badge-success" : "badge badge-danger";
    };
    const text = () => {
      return type === 1 ? "Active" : "Deactive";
    };
    return <span className={statusCheck()}>{text()}</span>;
  };
  return (
    <Container
      fluid
      style={{ marginButtom: "20px" }}
      className="main-content-container px-4"
    >
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Post Details"
          subtitle="Post Details"
          className="text-sm-left"
        />
      </Row>
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="bg-info" style={{ color: "white" }}>
              Post Details
            </CardHeader>
            <CardBody className="p-3">
              <div>
                <b> Title </b> : {postdetail.title}
              </div>
              <hr></hr>
              <div>
                <b> Description </b> : {postdetail.description}
              </div>
              <hr></hr>
              <div>
                <b> Price </b> : {postdetail.price}
              </div>
              <hr></hr>
              <div>
                <b> Post Type </b> : {fileType(postdetail.post_type)}
              </div>
              <hr></hr>
              <div>
                <b> status </b> : {status(postdetail.status)}
              </div>
              <hr></hr>
              <div>
                <b> Created </b> : {dates(postdetail.created)}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: "10px" }}>
        <Col md="12">
          <Card>
            <CardHeader style={{ color: "white" }} className="bg-info">
              Attached File
            </CardHeader>
            <CardBody>
              {postdetail.post_type !== 3 ? (
                postdetail.post_type === 1 ? (
                  <PdfView url={postdetail.url} />
                ) : (
                  <b>
                    <b>Audio</b> <Audio url={postdetail.audio} />
                    <b>Audio Sample</b> <Audio url={postdetail.audio_sample} />
                  </b>
                )
              ) : (
                <div>
                  <b>Audio</b> : <Audio url={postdetail.audio} />
                  <b>Audio Sample</b> : <Audio url={postdetail.audio_sample} />
                  <hr></hr>
                  <PdfView url={postdetail.url} />
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      {postdetail.cover_pic.length > 0 && (
        <Row style={{ marginTop: "10px" }}>
          <Col md="12">
            <Card>
              <CardHeader style={{ color: "white" }} className="bg-info">
                Cover Picture
              </CardHeader>
              <CardBody>
              <Image src={postdetail.cover_pic} width="100%" height="375" />
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
      {postdetail.hasOwnProperty("profile") && (
        <Row style={{ marginTop: "10px" }}>
          <Col md="12">
            <Card>
              <CardHeader style={{ color: "white" }} className="bg-info">
                User Information
              </CardHeader>
              <CardBody>
                <div>
                  <b> Name </b> : {postdetail.username}
                </div>
                <hr></hr>
                <div>
                  <b> Email </b> : {postdetail.email}
                </div>
                <hr></hr>
                <div>
                  <b> Profile Pic </b> : <Image src={postdetail.profile} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PostDetails;
