import { AdvancedImage } from "@cloudinary/react"
import { Cloudinary } from "@cloudinary/url-gen"
import { Transformation } from "@cloudinary/url-gen"

// Import required actions.
import { thumbnail, scale } from "@cloudinary/url-gen/actions/resize"
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners"
import { sepia } from "@cloudinary/url-gen/actions/effect"
import { source } from "@cloudinary/url-gen/actions/overlay"
import { opacity, brightness } from "@cloudinary/url-gen/actions/adjust"
import { byAngle } from "@cloudinary/url-gen/actions/rotate"

// Import required qualifiers.
import { image } from "@cloudinary/url-gen/qualifiers/source"
import { Position } from "@cloudinary/url-gen/qualifiers/position"
import { compass } from "@cloudinary/url-gen/qualifiers/gravity"
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity"
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn"

const cld = new Cloudinary({
    cloud: {
        cloudName: process.env.CLOUDINARY_NAME,
        apiKey: process.env.CLOUDINARY_KEY,
        apiSecret: process.env.CLOUDINARY_SECRET,
    },
})

export default cld
/**
 * const myImage = cld.image('front_face');
 * 
  // Apply the transformation.
  myImage
  .resize(thumbnail().width(150).height(150).gravity(focusOn(FocusOn.face())))  // Crop the image.
  .roundCorners(byRadius(20))    // Round the corners.
  .effect(sepia())  // Apply a sepia effect.
  .overlay(   // Overlay the Cloudinary logo.
    source(
      image('cloudinary_icon_blue')
        .transformation(new Transformation()
        .resize(scale(50)) // Resize the logo.
          .adjust(opacity(60))  // Adjust the opacity of the logo.
        .adjust(brightness(200)))  // Adjust the brightness of the logo.       
    )
    .position(new Position().gravity(compass('south_east')).offsetX(5).offsetY(5))   // Position the logo.
  )
  .rotate(byAngle(10))  // Rotate the result.
  .format('png');   // Deliver as PNG. 

  // Render the transformed image in a React component.
  return (
    <div>
      <AdvancedImage cldImg={myImage} />
    </div>
  )
*/
