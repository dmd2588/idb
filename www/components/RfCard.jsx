import React from 'react';
import { Card, CardMedia, CardTitle, CardActions } from 'react-toolbox/lib/card';
import { Button } from 'react-toolbox/lib/button';

export default function RfCard (props) {
  return (
    <Card style={{width: '250px'}}>
      <CardTitle
        avatar="https://placeimg.com/80/80/animals"
        title={props.title}
        subtitle={props.subtitle}
      />
      <CardMedia
        aspectRatio="wide"
        image="https://placeimg.com/800/450/nature"
      />
      <CardActions>
        <Button href={props.link} label="Details" />
      </CardActions>
    </Card>
  )
}