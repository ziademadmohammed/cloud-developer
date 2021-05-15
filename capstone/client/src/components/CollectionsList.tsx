import * as React from "react";
import { CollectionModel } from "../types/CollectionModel";
import { getCollections, deleteCollection } from "../api/collections-api";
import { Card, Button, Divider, Icon } from "semantic-ui-react";
import { History } from "history";
import Auth from "../auth/Auth";
import { Link } from "react-router-dom";

interface CollectionsListProps {
  history: History;
  auth: Auth;
}

interface CollectionsListState {
  Collections: CollectionModel[];
}

export class CollectionsList extends React.PureComponent<
  CollectionsListProps,
  CollectionsListState
> {
  state: CollectionsListState = {
    Collections: [],
  };

  handleCreateCollection = () => {
    this.props.history.push(`/collections/create`);
  };

  onCollectionDelete = async (CollectionId: string) => {
    try {
      await deleteCollection(CollectionId, this.props.auth.getIdToken());
      this.setState({
        Collections: this.state.Collections.filter(
          (Collection) => Collection.id != CollectionId
        ),
      });
    } catch {
      alert("Image deletion failed");
    }
  };

  async componentDidMount() {
    try {
      const Collections = await getCollections(this.props.auth.getIdToken());
      this.setState({
        Collections,
      });
    } catch (e) {
      alert(`Failed to fetch Collections: ${e.message}`);
    }
  }

  render() {
    return (
      <div>
        <h1>My Collections</h1>

        <Button
          primary
          size="huge"
          className="add-button"
          onClick={this.handleCreateCollection}
        >
          Create new Collection
        </Button>

        <Divider clearing />

        <Card.Group>
          {this.state.Collections.map((Collection) => {
            return (
              <Card key={Collection.id}>
                <Card.Content>
                  <Card.Header>
                    <Link to={`/images/${Collection.id}`}>
                      {Collection.name}
                    </Link>
                    <Button
                      icon
                      color="red"
                      size="mini"
                      onClick={() => this.onCollectionDelete(Collection.id)}
                      floated="right"
                    >
                      <Icon name="delete" />
                    </Button>
                  </Card.Header>
                  <Card.Description>{Collection.description}</Card.Description>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      </div>
    );
  }
}
