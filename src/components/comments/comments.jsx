import './comments.css'
import Image from '../../components/image/image'
const Comments = () => {
    return  (
        <div className="comments">
            <div className="commentList">
                <span className='commentCount'>5 Comments</span>
                {/* COMMENT SECTION */}
                <div className="comment">
                    <Image path='/general/noAvatar.png' alt=''/>
                    <div className="commentContent">
                        <span className="commentUsername">John Doe</span>
                        <p className="commentText">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat temporibus reiciendis, recusandae qui expedita ipsum nam quia asperiores cum eaque fugit? Blanditiis tempore dolorem delectus! Nostrum molestiae quo illo! Quae!</p>
                        <span className='commentTime'>1h</span>
                    </div>
                </div>
                {/* COMMENT SECTION */}
                <div className="comment">
                    <Image path='/general/noAvatar.png' alt=''/>
                    <div className="commentContent">
                        <span className="commentUsername">John Doe</span>
                        <p className="commentText">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat temporibus reiciendis, recusandae qui expedita ipsum nam quia asperiores cum eaque fugit? Blanditiis tempore dolorem delectus! Nostrum molestiae quo illo! Quae!</p>
                        <span className='commentTime'>1h</span>
                    </div>
                </div>
                {/* COMMENT SECTION */}
                <div className="comment">
                    <Image path='/general/noAvatar.png' alt=''/>
                    <div className="commentContent">
                        <span className="commentUsername">John Doe</span>
                        <p className="commentText">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat temporibus reiciendis, recusandae qui expedita ipsum nam quia asperiores cum eaque fugit? Blanditiis tempore dolorem delectus! Nostrum molestiae quo illo! Quae!</p>
                        <span className='commentTime'>1h</span>
                    </div>
                </div>
                {/* COMMENT SECTION */}
                <div className="comment">
                    <Image path='/general/noAvatar.png' alt=''/>
                    <div className="commentContent">
                        <span className="commentUsername">John Doe</span>
                        <p className="commentText">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat temporibus reiciendis, recusandae qui expedita ipsum nam quia asperiores cum eaque fugit? Blanditiis tempore dolorem delectus! Nostrum molestiae quo illo! Quae!</p>
                        <span className='commentTime'>1h</span>
                    </div>
                </div>
            </div>

            <form className='commentForm'>
                <input type="text" placeholder='Add a comment' />
                <div className="emoji">
                    <div>😄</div>
                </div>
            </form>
        </div>
    )
}

export default Comments