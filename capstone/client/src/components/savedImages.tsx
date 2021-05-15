import * as React from "react";
import { ImageModel } from "../types/ImageModel";
import { getSaved, deleteImage } from "../api/images-api";
import { Card, Divider, Button, Icon, Image } from "semantic-ui-react";
import { History } from "history";
import Auth from "../auth/Auth";

interface savedImagesProps {
  history: History;
  auth: Auth;
}

interface savedImagesState {
  images: ImageModel[];
}

export class SavedImages extends React.PureComponent<
  savedImagesProps,
  savedImagesState
> {
  state: savedImagesState = {
    images: [],
  };

  onSaveDelete = async (imageId: string) => {
    try {
      await deleteImage(imageId, this.props.auth.getIdToken());
      this.setState({
        images: this.state.images.filter((image) => image.imageId != imageId),
      });
    } catch {
      alert("saved deletion failed");
    }
  };

  async componentDidMount() {
    try {
      const images = await getSaved(this.props.auth.getIdToken());
      this.setState({
        images,
      });
    } catch (e) {
      alert(`Failed to fetch saved : ${e.message}`);
    }
  }

  render() {
    return (
      <div>
        <h1>My saved</h1>

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
                      onClick={() => this.onSaveDelete(image.imageId)}
                      floated="right"
                    >
                      Remove
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
