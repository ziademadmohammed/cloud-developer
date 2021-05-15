import * as React from "react";
import { Card, Button, Icon } from "semantic-ui-react";
import { CollectionModel } from "../types/CollectionModel";
import { Link } from "react-router-dom";

interface CollectionCardProps {
  Collection: CollectionModel;
}

interface CollectionCardState {}

export class Collection extends React.PureComponent<
  CollectionCardProps,
  CollectionCardState
> {
  render() {
    return (
      <Card>
        <Card.Content>
          <Card.Header>
            <Link to={`/images/${this.props.Collection.id}`}>
              {this.props.Collection.name}
            </Link>
            <Button icon color="red" size="mini" floated="right">
              <Icon name="delete" />
            </Button>
          </Card.Header>
          <Card.Description>
            {this.props.Collection.description}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
