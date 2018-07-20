import test from 'ava';
import { Mutation } from '../../../main-thread/mutate';
import { Nodes } from '../../../main-thread/nodes';

test.beforeEach(t => {
  const baseElement = document.createElement('div');
  const nodesInstance = new Nodes(baseElement);
  t.context = {
    mutation: new Mutation(nodesInstance, new Worker(''))
  };

});


