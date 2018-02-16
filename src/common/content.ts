export class ContentInfo
{
  constructor(
    public title: string,
    public caption: string,
    public subcaption: string,
    public image: string,
    public isLiked: boolean,
    public isDisliked: boolean,
    public link: string
  )
  {
    this.title = this.title.trim();
    this.caption = this.caption.trim();
    this.subcaption = this.subcaption.trim();
    this.image = this.image.trim();
    this.link = this.link.trim();
  }
}
