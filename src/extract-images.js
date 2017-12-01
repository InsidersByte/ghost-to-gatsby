import visit from 'unist-util-visit';

const nodetoDef = (a = {}, b = {}) => ({
  url: a.url || b.url,
  alt: a.alt || b.alt,
});

const extractImages = ast => {
  const defs = [];
  const out = [];

  visit(ast, 'image', node => {
    out.push(nodetoDef(node));
  });

  visit(ast, 'definition', node => {
    defs[node.identifier] = node;
  });

  visit(ast, 'imageReference', node => {
    const id = node.identifier;

    if (Object.prototype.hasOwnProperty.call(defs, id)) {
      const def = defs[id];

      if (def) {
        out.push(nodetoDef(def, node));
      }
    }
  });

  return out;
};

export default extractImages;
