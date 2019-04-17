/**
 * Created by shangfanfan on 2016/6/21 0021.
 */


// 复杂的自定义覆盖物
function ComplexCustomOverlay(point, html){
    this._point = point;
    this._html = html;
}
ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function(map){
    this._map = map;
    var div = this._div = document.createElement("div");
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    div.className = "baidu-photo-div";

    var span = this._span = document.createElement("span");
    span.className="baidu-photo-span";
    div.appendChild(span);
    span.innerHTML = this._html ;

    map.getPanes().labelPane.appendChild(div);

    return div;
};
ComplexCustomOverlay.prototype.draw = function(){
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x + "px";
    this._div.style.top  = pixel.y - 30 + "px";
};
