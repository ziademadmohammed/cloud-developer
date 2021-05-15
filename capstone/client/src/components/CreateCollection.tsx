import * as React from "react";
import { Form, Button } from "semantic-ui-react";
import { createCollection } from "../api/collections-api";
import { Redirect } from "react-router-dom";
import Auth from "../auth/Auth";

interface CreateCollectionProps {
  auth: Auth;
}

interface CreateCollectionState {
  name: string;
  description: string;
  uploadingCollection: boolean;
  redirect: boolean;
}

export class CreateCollection extends React.PureComponent<
  CreateCollectionProps,
  CreateCollectionState
> {
  state: CreateCollectionState = {
    name: "",
    description: "",
    uploadingCollection: false,
    redirect: false,
  };

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: event.target.value });
  };

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      if (!this.state.name || !this.state.description) {
        alert("Name and description should be provided");
        return;
      }

      this.setUploadState(true);
      const Collection = await createCollection(this.props.auth.getIdToken(), {
        name: this.state.name,
        description: this.state.description,
      });

      console.log("Created description", Collection);

      alert("Collection was created!");
      this.setRedirect(true);
    } catch (e) {
      alert("Could not upload an image: " + e.message);
    } finally {
      this.setUploadState(false);
    }
  };

  setUploadState(uploadingCollection: boolean) {
    this.setState({
      uploadingCollection: uploadingCollection,
    });
  }

  setRedirect(redirect: boolean) {
    this.setState({
      redirect: true,
    });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
  };

  render() {
    return (
      <div>
        {this.renderRedirect()}
        <h1>Upload new Collection</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <input
              placeholder="Collection name"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <input
              placeholder="Collection description"
              value={this.state.description}
              onChange={this.handleDescriptionChange}
            />
          </Form.Field>
          {this.renderButton()}
        </Form>
      </div>
    );
  }

  renderButton() {
    return (
      <Button loading={this.state.uploadingCollection} type="submit">
        Create
      </Button>
    );
  }
}
