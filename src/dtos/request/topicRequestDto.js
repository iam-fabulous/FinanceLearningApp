class TopicRequestDto {
  constructor(data) {
    if(data.title === '' || data.content === ''){
      throw new Error('Title and content are required')
    }
    this.title = data.title;
    this.content = data.content;
  }
}

module.exports = TopicRequestDto;
