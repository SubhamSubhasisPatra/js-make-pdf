// some helpers for working with svg
var svgHelp = {
    translate: function(x, y) {
      return 'translate(' + x.toFixed(2) + ',' + y.toFixed(2) + ')';
    },
    rotate: function(d) {
      return 'rotate(' + d.toFixed(2) + ')';
    },
    polygon: function (points) {
      points = points.map(function(p) {
        return p.map(prop('toFixed', 2)).join(',');
      });
      return 'M' + points.join('L') + 'Z';
    }
  };
  
  // generate a projection transformation from 3d to 2d
  function perspective(camera) {
    var cx = camera[0],
        cy = camera[1],
        cz = camera[2];
  
    return function (points) {
      return points.map(function(point) {
        var px = point[0],
            py = point[1],
            pz = point[2];
        return [ ((cx - px) * cz) / (pz - cz) + cx,
                 ((cy - py) * cz) / (pz - cz) + cy ];
      })
    };
  }
  
  function functor(x) {
    return _.isFunction(x) ? x : function() { return x };
  }
  
  // prop('x')({ x: 3 }) -> 3
  // prop('slice', 1, 1)([0, 1, 2, 3]) -> [1]
  function prop(p) {
    var args = _.rest(arguments);
    return function(o) {
      return functor(o[p]).apply(o, args);
    };
  }
  
  function accessor(target, config, name, isNotFunctor) {
    target[name] = function (value) {
      if (!arguments.length) return config[name];
      config[name] = isNotFunctor ? value : functor(value);
      return target;
    };
  }