var getColumnWidthPercentage = function(columnNumber, marginLeft,
    marginRight, dividerByColumn) {
  // Solve this equation:
  // marginLeft + columnNumber * x + (columnNumber - 1) * x * dividerByColumn + marginRight = 1
  return (1 - marginLeft - marginRight) /
      (columnNumber + (columnNumber - 1) * dividerByColumn);
};

var getRowHeightPercentage = function(rowNumber, marginTop,
    marginBottom, dividerByRow) {
  return (1 - marginTop - marginBottom) /
      (rowNumber + (rowNumber - 1) * dividerByRow);
};

var plot = function(targetSelectorStr, data, layout) {
  var svg = d3.select(targetSelectorStr)
          .append("svg")
          .attr("class", "rkm-background")
          .attr("viewBox", "0 0 " + layout.width + " " + layout.height)
          .attr("preserveAspectRatio", "xMinYMin meet");
  var columns = svg.selectAll("g.rkm-column")
    .data(data.ranks)
    .enter()
    .append("g")
    .attr("class", "rmk-column");

  var columnNumber = data.ranks.length;
  var rowNumber = data.ranks[0].length;

  var marginTopPx = layout.margin.top * layout.height;
  var marginBottomPx = layout.margin.bottom * layout.height;
  var marginLeftPx = layout.margin.left * layout.width;
  var marginRightPx = layout.margin.right * layout.width;

  var dividerByColumn = 0.05;
  var dividerByRow = 0.10;

  var columnWidthPx = layout.width * getColumnWidthPercentage(columnNumber,
      layout.margin.left, layout.margin.right, dividerByColumn);
  var dividerWidthPx = columnWidthPx * dividerByColumn;

  var rowHeightPx = layout.height * getRowHeightPercentage(rowNumber,
      layout.margin.top, layout.margin.bottom, dividerByRow);
  var dividerHeightPx = rowHeightPx * dividerByRow;

  var xscale = function(columnIndex) {
    return marginLeftPx + columnIndex * (columnWidthPx + dividerWidthPx);
  };

  var yscale = function(rowIndex) {
    return marginTopPx + rowIndex * (rowHeightPx + dividerHeightPx);
  };

  columns.each(function(columnData, columnIndex) {
    var targetIndex = columnData.findIndex(function(elem) {
      return elem == data.target;
    });
    d3.select(this)
      .selectAll("rect.rkm-item")
      .data(columnData)
      .enter()
      .append("rect")
      .attr("class", function(d, rowIndex) {
        if (targetIndex == -1) {
          return "rkm-item";
        }
        return rowIndex < targetIndex ? "rkm-item" : "rkm-item-highlight";
      })
      .attr("x", function(d) {
        return xscale(columnIndex);
      })
      .attr("y", function(d, rowIndex) {
         return yscale(rowIndex);
       })
       .attr("width", columnWidthPx)
       .attr("height", rowHeightPx);

    d3.select(this)
      .selectAll("text.rkm-item-label")
      .data(columnData)
      .enter()
      .append("text")
      .attr("class", function(d, rowIndex) {
        if (targetIndex == -1) {
          return "rkm-item-label";
        }
        return rowIndex < targetIndex ?
            "rkm-item-label" : "rkm-item-label rkm-item-label-highlight";
      })
      .attr("x", function(d) {
        return xscale(columnIndex) + columnWidthPx / 2;
      })
      .attr("y", function(d, rowIndex) {
        return yscale(rowIndex) + rowHeightPx / 2;
      })
      .text(function(d) {
        return d;
      });
  })
};
