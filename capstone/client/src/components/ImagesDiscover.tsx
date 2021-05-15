import * as React from "react";
import { ImageModel } from "../types/ImageModel";
import { getAllImages, saveImage } from "../api/images-api";
import { Card, Divider, Button, Icon, Image } from "semantic-ui-react";
import { History } from "history";
import Auth from "../auth/Auth";

interface ImagesDiscoverProps {
  history: History;
  auth: Auth;
  match: {
    params: {
      CollectionId: string;
    };
  };
}

interface ImagesDiscoverState {
  images: ImageModel[];
}

export class ImagesDiscover extends React.PureComponent<
  ImagesDiscoverProps,
  ImagesDiscoverState
> {
  state: ImagesDiscoverState = {
    images: [],
  };

  async componentDidMount() {
    try {
      const images = await getAllImages(this.props.auth.getIdToken());
      this.setState({
        images: images.filter((image) => image.isSaved != true),
      });
    } catch (e) {
      alert(`Failed to fetch images for Collection : ${e.message}`);
    }
  }

  onImageSave = async (imageId: string) => {
    try {
      const replyInfo = await saveImage(imageId, this.props.auth.getIdToken());
      console.log("Saved image", replyInfo);

      alert("Saved !");
    } catch {
      alert("saved image failed");
    }
  };

  render() {
    return (
      <div>
        <h1>Discover</h1>

        <Divider clearing />

        <Card.Group itemsPerRow={3}>
          {this.state.images.map((image) => {
            return (
              <Card fluid color="blue" key={image.imageId}>
                <Card.Content>
                  <Card.Header>
                    {image.title}
                    <Button
                      icon
                      color="red"
                      size="small"
                      onClick={() => this.onImageSave(image.imageId)}
                      floated="right"
                    >
                      <Icon name="pin" />
                    </Button>
                  </Card.Header>
                  <Card.Description>{image.timestamp}</Card.Description>
                  {image.imageUrl && <Image src={image.imageUrl} />}
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      </div>
    );
  }
}
