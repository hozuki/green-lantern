/**
 * Created by MIC on 2015/11/30.
 */

import ICloneable from "../../mic/ICloneable";
import IBitmapFilter from "../../webgl/IBitmapFilter";

interface BitmapFilter extends IBitmapFilter, ICloneable<BitmapFilter> {
}

export default BitmapFilter;
