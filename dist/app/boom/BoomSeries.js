System.register(["app/core/time_series2", "lodash", "./index", "./BoomSeriesUtils", "./BoomUtils", "./../GrafanaUtils"], function (exports_1, context_1) {
    "use strict";
    var time_series2_1, lodash_1, index_1, BoomSeriesUtils_1, BoomUtils_1, GrafanaUtils_1, BoomSeries;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (time_series2_1_1) {
                time_series2_1 = time_series2_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (BoomSeriesUtils_1_1) {
                BoomSeriesUtils_1 = BoomSeriesUtils_1_1;
            },
            function (BoomUtils_1_1) {
                BoomUtils_1 = BoomUtils_1_1;
            },
            function (GrafanaUtils_1_1) {
                GrafanaUtils_1 = GrafanaUtils_1_1;
            }
        ],
        execute: function () {
            BoomSeries = (function () {
                function BoomSeries(seriesData, panelDefaultPattern, panelPatterns, options, scopedVars, templateSrv, timeSrv) {
                    this.pattern = undefined;
                    this.template_value = "";
                    this.row_col_wrapper = "_";
                    this.display_value = "-";
                    this.tooltip = "-";
                    this.value = NaN;
                    this.value_formatted = "-";
                    this.link = "-";
                    this.hidden = false;
                    this._metricname = "";
                    this._tags = [];
                    var series = new time_series2_1.default({
                        alias: seriesData.target,
                        datapoints: seriesData.datapoints || []
                    });
                    series.flotpairs = series.getFlotPairs("connected");
                    this.debug_mode = options && options.debug_mode === true ? true : false;
                    this.row_col_wrapper = options && options.row_col_wrapper ? options.row_col_wrapper : this.row_col_wrapper;
                    this.currentTimeStamp = BoomUtils_1.getCurrentTimeStamp(series.dataPoints);
                    this.seriesName = series.alias || series.aliasEscaped || series.label || series.id || "";
                    var getMatchingAndEnabledPattern = function (patterns, seriesName) { return patterns.find(function (p) { return seriesName.match(p.pattern) && p.disabled !== true; }); };
                    this.pattern = getMatchingAndEnabledPattern(panelPatterns, this.seriesName) || panelDefaultPattern;
                    this.decimals = this.pattern.decimals || panelDefaultPattern.decimals || 2;
                    this.value = BoomUtils_1.getSeriesValue(series, this.pattern.valueName);
                    this.value_formatted = GrafanaUtils_1.get_formatted_value(this.value, this.decimals, this.pattern.format);
                    this.display_value = ((lodash_1.default.isNaN(this.value) || this.value === null) ? this.pattern.null_value : String(this.value)).toString();
                    this.hidden = BoomSeriesUtils_1.doesValueNeedsToHide(this.value, this.pattern.filter);
                    this._metricname = this.pattern.delimiter.toLowerCase() === "tag" ? index_1.getMetricNameFromTaggedAlias(seriesData.target) : "";
                    this._tags = this.pattern.delimiter.toLowerCase() === "tag" ? index_1.getLablesFromTaggedAlias(seriesData.target, this._metricname) : [];
                    this.row_name = BoomUtils_1.getRowName(this.pattern.row_name, this.pattern.delimiter, this.row_col_wrapper, this.seriesName, this._metricname, this._tags);
                    this.row_name_raw = BoomUtils_1.getRowName(this.pattern.row_name, this.pattern.delimiter, this.row_col_wrapper, this.seriesName, this._metricname, this._tags);
                    this.col_name = BoomUtils_1.getColName(this.pattern.col_name, this.pattern.delimiter, this.row_col_wrapper, this.seriesName, this.row_name, this._metricname, this._tags);
                    this.thresholds = BoomSeriesUtils_1.getThresholds(templateSrv.replace(this.pattern.thresholds, scopedVars).split(",").map(function (d) { return +d; }), this.pattern.enable_time_based_thresholds, this.pattern.time_based_thresholds, this.currentTimeStamp);
                    this.color_bg = BoomSeriesUtils_1.getBGColor(this.value, this.pattern, this.thresholds, templateSrv.replace(this.pattern.bgColors, scopedVars).split("|"), templateSrv.replace(this.pattern.bgColors_overrides, scopedVars).split("|"));
                    this.color_text = BoomSeriesUtils_1.getTextColor(this.value, this.pattern, this.thresholds, templateSrv.replace(this.pattern.textColors, scopedVars).split("|"), templateSrv.replace(this.pattern.textColors_overrides, scopedVars).split("|"));
                    this.template_value = BoomUtils_1.getDisplayValueTemplate(this.value, this.pattern, this.seriesName, this.row_col_wrapper, this.thresholds);
                    this.link = BoomSeriesUtils_1.getLink(this.pattern.enable_clickable_cells, this.pattern.clickable_cells_link, timeSrv.timeRangeForUrl());
                    this.link = BoomUtils_1.replaceDelimitedColumns(this.link, this.seriesName, this.pattern.delimiter, this.row_col_wrapper);
                    this.tooltip = this.pattern.tooltipTemplate || "Series : _series_ <br/>Row Name : _row_name_ <br/>Col Name : _col_name_ <br/>Value : _value_";
                    this.replaceSeriesRowColTokens();
                    this.link = BoomSeriesUtils_1.GetValuesReplaced(this.link, this.value, this.value_formatted, series.stats, this.decimals, this.pattern.format, this._metricname, this._tags, this.pattern.delimiter || "");
                    this.tooltip = BoomSeriesUtils_1.GetValuesReplaced(this.tooltip, this.value, this.value_formatted, series.stats, this.decimals, this.pattern.format, this._metricname, this._tags, this.pattern.delimiter || "");
                    this.display_value = BoomSeriesUtils_1.GetValuesReplaced(this.display_value, this.value, this.value_formatted, series.stats, this.decimals, this.pattern.format, this._metricname, this._tags, this.pattern.delimiter || "");
                    this.row_name = index_1.replaceTokens(this.row_name);
                    this.col_name = index_1.replaceTokens(this.col_name);
                    this.display_value = index_1.replaceTokens(this.display_value);
                    this.row_name = templateSrv.replace(this.row_name, scopedVars);
                    this.col_name = templateSrv.replace(this.col_name, scopedVars);
                    this.display_value = templateSrv.replace(this.display_value, scopedVars);
                    this.tooltip = templateSrv.replace(this.tooltip, scopedVars);
                    this.link = templateSrv.replace(this.link, scopedVars);
                    if (this.debug_mode !== true) {
                        delete this.seriesName;
                        delete this.pattern;
                        delete this.thresholds;
                        delete this.decimals;
                        delete this.template_value;
                        delete this.value_formatted;
                        delete this.currentTimeStamp;
                    }
                }
                BoomSeries.prototype.replaceSeriesRowColTokens = function () {
                    this.link = this.link.replace(new RegExp("_series_", "g"), this.seriesName.toString().trim());
                    this.tooltip = this.tooltip.replace(new RegExp("_series_", "g"), this.seriesName.toString().trim());
                    this.display_value = this.template_value.replace(new RegExp("_series_", "g"), this.seriesName.toString());
                    this.col_name = this.col_name.replace(new RegExp("_row_name_", "g"), this.row_name.toString());
                    this.link = this.link.replace(new RegExp("_row_name_", "g"), index_1.getActualNameWithoutTokens(this.row_name.toString()).trim());
                    this.tooltip = this.tooltip.replace(new RegExp("_row_name_", "g"), index_1.getActualNameWithoutTokens(this.row_name.toString()).trim());
                    this.display_value = this.display_value.replace(new RegExp("_row_name_", "g"), this.row_name.toString());
                    this.row_name = this.row_name.replace(new RegExp("_col_name_", "g"), this.col_name.toString());
                    this.link = this.link.replace(new RegExp("_col_name_", "g"), index_1.getActualNameWithoutTokens(this.col_name.toString()).trim());
                    this.tooltip = this.tooltip.replace(new RegExp("_col_name_", "g"), index_1.getActualNameWithoutTokens(this.col_name.toString()).trim());
                    this.display_value = this.display_value.replace(new RegExp("_col_name_", "g"), this.col_name.toString());
                };
                return BoomSeries;
            }());
            exports_1("BoomSeries", BoomSeries);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbVNlcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvYm9vbS9Cb29tU2VyaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBVUE7Z0JBd0JJLG9CQUFZLFVBQWUsRUFBRSxtQkFBd0IsRUFBRSxhQUFvQixFQUFFLE9BQVksRUFBRSxVQUFlLEVBQUUsV0FBZ0IsRUFBRSxPQUFZO29CQXJCbEksWUFBTyxHQUFRLFNBQVMsQ0FBQztvQkFHekIsbUJBQWMsR0FBRyxFQUFFLENBQUM7b0JBQ3BCLG9CQUFlLEdBQUcsR0FBRyxDQUFDO29CQU92QixrQkFBYSxHQUFHLEdBQUcsQ0FBQztvQkFDcEIsWUFBTyxHQUFHLEdBQUcsQ0FBQztvQkFDZCxVQUFLLEdBQUcsR0FBRyxDQUFDO29CQUNaLG9CQUFlLEdBQUcsR0FBRyxDQUFDO29CQUN0QixTQUFJLEdBQUcsR0FBRyxDQUFDO29CQUVYLFdBQU0sR0FBWSxLQUFLLENBQUM7b0JBQ3hCLGdCQUFXLEdBQUcsRUFBRSxDQUFDO29CQUNqQixVQUFLLEdBQVUsRUFBRSxDQUFDO29CQUlyQixJQUFJLE1BQU0sR0FBRyxJQUFJLHNCQUFVLENBQUM7d0JBQ3hCLEtBQUssRUFBRSxVQUFVLENBQUMsTUFBTTt3QkFDeEIsVUFBVSxFQUFFLFVBQVUsQ0FBQyxVQUFVLElBQUksRUFBRTtxQkFDMUMsQ0FBQyxDQUFDO29CQUNILE1BQU0sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFFcEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUN4RSxJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FB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QVksRUFBRSxHQUFHLENBQUMsRUFBRSxrQ0FBMEIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDMUgsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLEVBQUUsa0NBQTBCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7b0JBQ2hJLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFFN0csQ0FBQztnQkFFTCxpQkFBQztZQUFELENBQUMsQUE1R0QsSUE0R0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3JhZmFuYS1zZGstbW9ja3MvYXBwL2hlYWRlcnMvY29tbW9uLmQudHNcIiAvPlxuXG5pbXBvcnQgVGltZVNlcmllcyBmcm9tIFwiYXBwL2NvcmUvdGltZV9zZXJpZXMyXCI7XG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgeyByZXBsYWNlVG9rZW5zLCBnZXRBY3R1YWxOYW1lV2l0aG91dFRva2VucywgZ2V0TWV0cmljTmFtZUZyb21UYWdnZWRBbGlhcywgZ2V0TGFibGVzRnJvbVRhZ2dlZEFsaWFzIH0gZnJvbSBcIi4vaW5kZXhcIjtcbmltcG9ydCB7IGdldFRocmVzaG9sZHMsIGdldEJHQ29sb3IsIGdldFRleHRDb2xvciwgZ2V0TGluaywgZG9lc1ZhbHVlTmVlZHNUb0hpZGUsIEdldFZhbHVlc1JlcGxhY2VkIH0gZnJvbSBcIi4vQm9vbVNlcmllc1V0aWxzXCI7XG5pbXBvcnQgeyBnZXREaXNwbGF5VmFsdWVUZW1wbGF0ZSwgZ2V0U2VyaWVzVmFsdWUsIGdldEN1cnJlbnRUaW1lU3RhbXAsIHJlcGxhY2VEZWxpbWl0ZWRDb2x1bW5zLCBnZXRSb3dOYW1lLCBnZXRDb2xOYW1lIH0gZnJvbSBcIi4vQm9vbVV0aWxzXCI7XG5pbXBvcnQgeyBnZXRfZm9ybWF0dGVkX3ZhbHVlIH0gZnJvbSBcIi4vLi4vR3JhZmFuYVV0aWxzXCI7XG5pbXBvcnQgeyBJQm9vbVNlcmllcyB9IGZyb20gXCIuL0Jvb20uaW50ZXJmYWNlXCI7XG5cbmNsYXNzIEJvb21TZXJpZXMgaW1wbGVtZW50cyBJQm9vbVNlcmllcyB7XG5cbiAgICBwcml2YXRlIGRlYnVnX21vZGU6IEJvb2xlYW47XG4gICAgcHJpdmF0ZSBwYXR0ZXJuOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgcHJpdmF0ZSBzZXJpZXNOYW1lOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjdXJyZW50VGltZVN0YW1wOiBEYXRlO1xuICAgIHByaXZhdGUgdGVtcGxhdGVfdmFsdWUgPSBcIlwiO1xuICAgIHByaXZhdGUgcm93X2NvbF93cmFwcGVyID0gXCJfXCI7XG4gICAgcHJpdmF0ZSBkZWNpbWFsczogTnVtYmVyO1xuICAgIHB1YmxpYyBjb2xfbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyByb3dfbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyByb3dfbmFtZV9yYXc6IHN0cmluZztcbiAgICBwdWJsaWMgY29sb3JfYmc6IHN0cmluZztcbiAgICBwdWJsaWMgY29sb3JfdGV4dDogc3RyaW5nO1xuICAgIHB1YmxpYyBkaXNwbGF5X3ZhbHVlID0gXCItXCI7XG4gICAgcHVibGljIHRvb2x0aXAgPSBcIi1cIjtcbiAgICBwdWJsaWMgdmFsdWUgPSBOYU47XG4gICAgcHVibGljIHZhbHVlX2Zvcm1hdHRlZCA9IFwiLVwiO1xuICAgIHB1YmxpYyBsaW5rID0gXCItXCI7XG4gICAgcHVibGljIHRocmVzaG9sZHM6IE51bWJlcltdO1xuICAgIHB1YmxpYyBoaWRkZW46IEJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgX21ldHJpY25hbWUgPSBcIlwiO1xuICAgIHB1YmxpYyBfdGFnczogYW55W10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHNlcmllc0RhdGE6IGFueSwgcGFuZWxEZWZhdWx0UGF0dGVybjogYW55LCBwYW5lbFBhdHRlcm5zOiBhbnlbXSwgb3B0aW9uczogYW55LCBzY29wZWRWYXJzOiBhbnksIHRlbXBsYXRlU3J2OiBhbnksIHRpbWVTcnY6IGFueSkge1xuXG4gICAgICAgIGxldCBzZXJpZXMgPSBuZXcgVGltZVNlcmllcyh7XG4gICAgICAgICAgICBhbGlhczogc2VyaWVzRGF0YS50YXJnZXQsXG4gICAgICAgICAgICBkYXRhcG9pbnRzOiBzZXJpZXNEYXRhLmRhdGFwb2ludHMgfHwgW11cbiAgICAgICAgfSk7XG4gICAgICAgIHNlcmllcy5mbG90cGFpcnMgPSBzZXJpZXMuZ2V0RmxvdFBhaXJzKFwiY29ubmVjdGVkXCIpO1xuXG4gICAgICAgIHRoaXMuZGVidWdfbW9kZSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5kZWJ1Z19tb2RlID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB0aGlzLnJvd19jb2xfd3JhcHBlciA9IG9wdGlvbnMgJiYgb3B0aW9ucy5yb3dfY29sX3dyYXBwZXIgPyBvcHRpb25zLnJvd19jb2xfd3JhcHBlciA6IHRoaXMucm93X2NvbF93cmFwcGVyO1xuICAgICAgICB0aGlzLmN1cnJlbnRUaW1lU3RhbXAgPSBnZXRDdXJyZW50VGltZVN0YW1wKHNlcmllcy5kYXRhUG9pbnRzKTtcbiAgICAgICAgdGhpcy5zZXJpZXNOYW1lID0gc2VyaWVzLmFsaWFzIHx8IHNlcmllcy5hbGlhc0VzY2FwZWQgfHwgc2VyaWVzLmxhYmVsIHx8IHNlcmllcy5pZCB8fCBcIlwiO1xuXG4gICAgICAgIGxldCBnZXRNYXRjaGluZ0FuZEVuYWJsZWRQYXR0ZXJuID0gKHBhdHRlcm5zLCBzZXJpZXNOYW1lKSA9PiBwYXR0ZXJucy5maW5kKHAgPT4gc2VyaWVzTmFtZS5tYXRjaChwLnBhdHRlcm4pICYmIHAuZGlzYWJsZWQgIT09IHRydWUpO1xuICAgICAgICB0aGlzLnBhdHRlcm4gPSBnZXRNYXRjaGluZ0FuZEVuYWJsZWRQYXR0ZXJuKHBhbmVsUGF0dGVybnMsIHRoaXMuc2VyaWVzTmFtZSkgfHwgcGFuZWxEZWZhdWx0UGF0dGVybjtcblxuICAgICAgICB0aGlzLmRlY2ltYWxzID0gdGhpcy5wYXR0ZXJuLmRlY2ltYWxzIHx8IHBhbmVsRGVmYXVsdFBhdHRlcm4uZGVjaW1hbHMgfHwgMjtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGdldFNlcmllc1ZhbHVlKHNlcmllcywgdGhpcy5wYXR0ZXJuLnZhbHVlTmFtZSk7XG4gICAgICAgIHRoaXMudmFsdWVfZm9ybWF0dGVkID0gZ2V0X2Zvcm1hdHRlZF92YWx1ZSh0aGlzLnZhbHVlLCB0aGlzLmRlY2ltYWxzLCB0aGlzLnBhdHRlcm4uZm9ybWF0KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5X3ZhbHVlID0gKChfLmlzTmFOKHRoaXMudmFsdWUpIHx8IHRoaXMudmFsdWUgPT09IG51bGwpID8gdGhpcy5wYXR0ZXJuLm51bGxfdmFsdWUgOiBTdHJpbmcodGhpcy52YWx1ZSkpLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuaGlkZGVuID0gZG9lc1ZhbHVlTmVlZHNUb0hpZGUodGhpcy52YWx1ZSwgdGhpcy5wYXR0ZXJuLmZpbHRlcik7XG4gICAgICAgIHRoaXMuX21ldHJpY25hbWUgPSB0aGlzLnBhdHRlcm4uZGVsaW1pdGVyLnRvTG93ZXJDYXNlKCkgPT09IFwidGFnXCIgPyBnZXRNZXRyaWNOYW1lRnJvbVRhZ2dlZEFsaWFzKHNlcmllc0RhdGEudGFyZ2V0KSA6IFwiXCI7XG4gICAgICAgIHRoaXMuX3RhZ3MgPSB0aGlzLnBhdHRlcm4uZGVsaW1pdGVyLnRvTG93ZXJDYXNlKCkgPT09IFwidGFnXCIgPyBnZXRMYWJsZXNGcm9tVGFnZ2VkQWxpYXMoc2VyaWVzRGF0YS50YXJnZXQsIHRoaXMuX21ldHJpY25hbWUpIDogW107XG5cbiAgICAgICAgdGhpcy5yb3dfbmFtZSA9IGdldFJvd05hbWUodGhpcy5wYXR0ZXJuLnJvd19uYW1lLCB0aGlzLnBhdHRlcm4uZGVsaW1pdGVyLCB0aGlzLnJvd19jb2xfd3JhcHBlciwgdGhpcy5zZXJpZXNOYW1lLCB0aGlzLl9tZXRyaWNuYW1lLCB0aGlzLl90YWdzKTtcbiAgICAgICAgdGhpcy5yb3dfbmFtZV9yYXcgPSBnZXRSb3dOYW1lKHRoaXMucGF0dGVybi5yb3dfbmFtZSwgdGhpcy5wYXR0ZXJuLmRlbGltaXRlciwgdGhpcy5yb3dfY29sX3dyYXBwZXIsIHRoaXMuc2VyaWVzTmFtZSwgdGhpcy5fbWV0cmljbmFtZSwgdGhpcy5fdGFncyk7XG4gICAgICAgIHRoaXMuY29sX25hbWUgPSBnZXRDb2xOYW1lKHRoaXMucGF0dGVybi5jb2xfbmFtZSwgdGhpcy5wYXR0ZXJuLmRlbGltaXRlciwgdGhpcy5yb3dfY29sX3dyYXBwZXIsIHRoaXMuc2VyaWVzTmFtZSwgdGhpcy5yb3dfbmFtZSwgdGhpcy5fbWV0cmljbmFtZSwgdGhpcy5fdGFncyk7XG5cbiAgICAgICAgdGhpcy50aHJlc2hvbGRzID0gZ2V0VGhyZXNob2xkcyh0ZW1wbGF0ZVNydi5yZXBsYWNlKHRoaXMucGF0dGVybi50aHJlc2hvbGRzLCBzY29wZWRWYXJzKS5zcGxpdChcIixcIikubWFwKGQgPT4gK2QpLCB0aGlzLnBhdHRlcm4uZW5hYmxlX3RpbWVfYmFzZWRfdGhyZXNob2xkcywgdGhpcy5wYXR0ZXJuLnRpbWVfYmFzZWRfdGhyZXNob2xkcywgdGhpcy5jdXJyZW50VGltZVN0YW1wKTtcbiAgICAgICAgdGhpcy5jb2xvcl9iZyA9IGdldEJHQ29sb3IodGhpcy52YWx1ZSwgdGhpcy5wYXR0ZXJuLCB0aGlzLnRocmVzaG9sZHMsIHRlbXBsYXRlU3J2LnJlcGxhY2UodGhpcy5wYXR0ZXJuLmJnQ29sb3JzLCBzY29wZWRWYXJzKS5zcGxpdChcInxcIiksIHRlbXBsYXRlU3J2LnJlcGxhY2UodGhpcy5wYXR0ZXJuLmJnQ29sb3JzX292ZXJyaWRlcywgc2NvcGVkVmFycykuc3BsaXQoXCJ8XCIpKTtcbiAgICAgICAgdGhpcy5jb2xvcl90ZXh0ID0gZ2V0VGV4dENvbG9yKHRoaXMudmFsdWUsIHRoaXMucGF0dGVybiwgdGhpcy50aHJlc2hvbGRzLCB0ZW1wbGF0ZVNydi5yZXBsYWNlKHRoaXMucGF0dGVybi50ZXh0Q29sb3JzLCBzY29wZWRWYXJzKS5zcGxpdChcInxcIiksIHRlbXBsYXRlU3J2LnJlcGxhY2UodGhpcy5wYXR0ZXJuLnRleHRDb2xvcnNfb3ZlcnJpZGVzLCBzY29wZWRWYXJzKS5zcGxpdChcInxcIikpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlX3ZhbHVlID0gZ2V0RGlzcGxheVZhbHVlVGVtcGxhdGUodGhpcy52YWx1ZSwgdGhpcy5wYXR0ZXJuLCB0aGlzLnNlcmllc05hbWUsIHRoaXMucm93X2NvbF93cmFwcGVyLCB0aGlzLnRocmVzaG9sZHMpO1xuXG4gICAgICAgIHRoaXMubGluayA9IGdldExpbmsodGhpcy5wYXR0ZXJuLmVuYWJsZV9jbGlja2FibGVfY2VsbHMsIHRoaXMucGF0dGVybi5jbGlja2FibGVfY2VsbHNfbGluaywgdGltZVNydi50aW1lUmFuZ2VGb3JVcmwoKSk7XG4gICAgICAgIHRoaXMubGluayA9IHJlcGxhY2VEZWxpbWl0ZWRDb2x1bW5zKHRoaXMubGluaywgdGhpcy5zZXJpZXNOYW1lLCB0aGlzLnBhdHRlcm4uZGVsaW1pdGVyLCB0aGlzLnJvd19jb2xfd3JhcHBlcik7XG5cbiAgICAgICAgdGhpcy50b29sdGlwID0gdGhpcy5wYXR0ZXJuLnRvb2x0aXBUZW1wbGF0ZSB8fCBcIlNlcmllcyA6IF9zZXJpZXNfIDxici8+Um93IE5hbWUgOiBfcm93X25hbWVfIDxici8+Q29sIE5hbWUgOiBfY29sX25hbWVfIDxici8+VmFsdWUgOiBfdmFsdWVfXCI7XG5cbiAgICAgICAgdGhpcy5yZXBsYWNlU2VyaWVzUm93Q29sVG9rZW5zKCk7XG5cbiAgICAgICAgdGhpcy5saW5rID0gR2V0VmFsdWVzUmVwbGFjZWQodGhpcy5saW5rLCB0aGlzLnZhbHVlLCB0aGlzLnZhbHVlX2Zvcm1hdHRlZCwgc2VyaWVzLnN0YXRzLCB0aGlzLmRlY2ltYWxzLCB0aGlzLnBhdHRlcm4uZm9ybWF0LCB0aGlzLl9tZXRyaWNuYW1lLCB0aGlzLl90YWdzLCB0aGlzLnBhdHRlcm4uZGVsaW1pdGVyIHx8IFwiXCIpO1xuICAgICAgICB0aGlzLnRvb2x0aXAgPSBHZXRWYWx1ZXNSZXBsYWNlZCh0aGlzLnRvb2x0aXAsIHRoaXMudmFsdWUsIHRoaXMudmFsdWVfZm9ybWF0dGVkLCBzZXJpZXMuc3RhdHMsIHRoaXMuZGVjaW1hbHMsIHRoaXMucGF0dGVybi5mb3JtYXQsIHRoaXMuX21ldHJpY25hbWUsIHRoaXMuX3RhZ3MsIHRoaXMucGF0dGVybi5kZWxpbWl0ZXIgfHwgXCJcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheV92YWx1ZSA9IEdldFZhbHVlc1JlcGxhY2VkKHRoaXMuZGlzcGxheV92YWx1ZSwgdGhpcy52YWx1ZSwgdGhpcy52YWx1ZV9mb3JtYXR0ZWQsIHNlcmllcy5zdGF0cywgdGhpcy5kZWNpbWFscywgdGhpcy5wYXR0ZXJuLmZvcm1hdCwgdGhpcy5fbWV0cmljbmFtZSwgdGhpcy5fdGFncywgdGhpcy5wYXR0ZXJuLmRlbGltaXRlciB8fCBcIlwiKTtcblxuICAgICAgICB0aGlzLnJvd19uYW1lID0gcmVwbGFjZVRva2Vucyh0aGlzLnJvd19uYW1lKTtcbiAgICAgICAgdGhpcy5jb2xfbmFtZSA9IHJlcGxhY2VUb2tlbnModGhpcy5jb2xfbmFtZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheV92YWx1ZSA9IHJlcGxhY2VUb2tlbnModGhpcy5kaXNwbGF5X3ZhbHVlKTtcblxuICAgICAgICB0aGlzLnJvd19uYW1lID0gdGVtcGxhdGVTcnYucmVwbGFjZSh0aGlzLnJvd19uYW1lLCBzY29wZWRWYXJzKTtcbiAgICAgICAgdGhpcy5jb2xfbmFtZSA9IHRlbXBsYXRlU3J2LnJlcGxhY2UodGhpcy5jb2xfbmFtZSwgc2NvcGVkVmFycyk7XG4gICAgICAgIHRoaXMuZGlzcGxheV92YWx1ZSA9IHRlbXBsYXRlU3J2LnJlcGxhY2UodGhpcy5kaXNwbGF5X3ZhbHVlLCBzY29wZWRWYXJzKTtcblxuICAgICAgICB0aGlzLnRvb2x0aXAgPSB0ZW1wbGF0ZVNydi5yZXBsYWNlKHRoaXMudG9vbHRpcCwgc2NvcGVkVmFycyk7XG4gICAgICAgIHRoaXMubGluayA9IHRlbXBsYXRlU3J2LnJlcGxhY2UodGhpcy5saW5rLCBzY29wZWRWYXJzKTtcblxuICAgICAgICBpZiAodGhpcy5kZWJ1Z19tb2RlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zZXJpZXNOYW1lO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMucGF0dGVybjtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnRocmVzaG9sZHM7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5kZWNpbWFscztcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnRlbXBsYXRlX3ZhbHVlO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMudmFsdWVfZm9ybWF0dGVkO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuY3VycmVudFRpbWVTdGFtcDtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIHByaXZhdGUgcmVwbGFjZVNlcmllc1Jvd0NvbFRva2VucygpIHtcblxuICAgICAgICB0aGlzLmxpbmsgPSB0aGlzLmxpbmsucmVwbGFjZShuZXcgUmVnRXhwKFwiX3Nlcmllc19cIiwgXCJnXCIpLCB0aGlzLnNlcmllc05hbWUudG9TdHJpbmcoKS50cmltKCkpO1xuICAgICAgICB0aGlzLnRvb2x0aXAgPSB0aGlzLnRvb2x0aXAucmVwbGFjZShuZXcgUmVnRXhwKFwiX3Nlcmllc19cIiwgXCJnXCIpLCB0aGlzLnNlcmllc05hbWUudG9TdHJpbmcoKS50cmltKCkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlfdmFsdWUgPSB0aGlzLnRlbXBsYXRlX3ZhbHVlLnJlcGxhY2UobmV3IFJlZ0V4cChcIl9zZXJpZXNfXCIsIFwiZ1wiKSwgdGhpcy5zZXJpZXNOYW1lLnRvU3RyaW5nKCkpO1xuXG4gICAgICAgIHRoaXMuY29sX25hbWUgPSB0aGlzLmNvbF9uYW1lLnJlcGxhY2UobmV3IFJlZ0V4cChcIl9yb3dfbmFtZV9cIiwgXCJnXCIpLCB0aGlzLnJvd19uYW1lLnRvU3RyaW5nKCkpO1xuICAgICAgICB0aGlzLmxpbmsgPSB0aGlzLmxpbmsucmVwbGFjZShuZXcgUmVnRXhwKFwiX3Jvd19uYW1lX1wiLCBcImdcIiksIGdldEFjdHVhbE5hbWVXaXRob3V0VG9rZW5zKHRoaXMucm93X25hbWUudG9TdHJpbmcoKSkudHJpbSgpKTtcbiAgICAgICAgdGhpcy50b29sdGlwID0gdGhpcy50b29sdGlwLnJlcGxhY2UobmV3IFJlZ0V4cChcIl9yb3dfbmFtZV9cIiwgXCJnXCIpLCBnZXRBY3R1YWxOYW1lV2l0aG91dFRva2Vucyh0aGlzLnJvd19uYW1lLnRvU3RyaW5nKCkpLnRyaW0oKSk7XG4gICAgICAgIHRoaXMuZGlzcGxheV92YWx1ZSA9IHRoaXMuZGlzcGxheV92YWx1ZS5yZXBsYWNlKG5ldyBSZWdFeHAoXCJfcm93X25hbWVfXCIsIFwiZ1wiKSwgdGhpcy5yb3dfbmFtZS50b1N0cmluZygpKTtcblxuICAgICAgICB0aGlzLnJvd19uYW1lID0gdGhpcy5yb3dfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoXCJfY29sX25hbWVfXCIsIFwiZ1wiKSwgdGhpcy5jb2xfbmFtZS50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5saW5rID0gdGhpcy5saW5rLnJlcGxhY2UobmV3IFJlZ0V4cChcIl9jb2xfbmFtZV9cIiwgXCJnXCIpLCBnZXRBY3R1YWxOYW1lV2l0aG91dFRva2Vucyh0aGlzLmNvbF9uYW1lLnRvU3RyaW5nKCkpLnRyaW0oKSk7XG4gICAgICAgIHRoaXMudG9vbHRpcCA9IHRoaXMudG9vbHRpcC5yZXBsYWNlKG5ldyBSZWdFeHAoXCJfY29sX25hbWVfXCIsIFwiZ1wiKSwgZ2V0QWN0dWFsTmFtZVdpdGhvdXRUb2tlbnModGhpcy5jb2xfbmFtZS50b1N0cmluZygpKS50cmltKCkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlfdmFsdWUgPSB0aGlzLmRpc3BsYXlfdmFsdWUucmVwbGFjZShuZXcgUmVnRXhwKFwiX2NvbF9uYW1lX1wiLCBcImdcIiksIHRoaXMuY29sX25hbWUudG9TdHJpbmcoKSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IHtcbiAgICBCb29tU2VyaWVzXG59O1xuIl19