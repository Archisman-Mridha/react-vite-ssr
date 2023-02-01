import ProfileImagePath from "../../assets/moeen.jpg"

import "./home.styles.css"

export function HomeComponent( ) {
    return (
        <div>
            <p>Welcome to Moeen's Home</p>
            <img src={ProfileImagePath} />
        </div>
    )
}
