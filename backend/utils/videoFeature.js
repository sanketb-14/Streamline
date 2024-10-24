class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
      excludedFields.forEach(el => delete queryObj[el]);

        // Handle tags filtering
    if (queryObj.tags) {
        queryObj.tags = { $in: queryObj.tags.split(',') };
      }

        // Handle date ranges
    if (queryObj.dateRange) {
        const [start, end] = queryObj.dateRange.split(',');
        queryObj.createdAt = {
          $gte: new Date(start),
          $lte: new Date(end)
        };
        delete queryObj.dateRange;
      }
// Handle view count ranges
      if (queryObj.viewsRange) {
        const [min, max] = queryObj.viewsRange.split(',').map(Number);
        queryObj.views = { $gte: min, $lte: max };
        delete queryObj.viewsRange;
      }
  
      // Advanced filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
  
    search() {
      if (this.queryString.search) {
        const searchRegex = new RegExp(this.queryString.search, 'i');
        this.query = this.query.find({
          $or: [
            { title: searchRegex },
            { description: searchRegex },
           
          ]
        });
      }
      return this;
    }
  
    sort() {
        if (this.queryString.sort) {
          const sortMapping = {
            popular: '-views', // Most viewed
            newest: '-createdAt', // Latest
            oldest: 'createdAt', // Oldest
            mostLiked: '-likes', // Most likes
            leastLiked: 'likes', // Least likes
            mostEngaged: '-engagement' // Most engagement (likes + dislikes)
          };
          let sortBy = this.queryString.sort;
          if (sortMapping[sortBy]) {
            sortBy = sortMapping[sortBy];
          }
          
          this.query = this.query.sort(sortBy);
        } else {
          this.query = this.query.sort('-createdAt');
        }
        return this

        
    }
  
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }
  
    paginate() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 12;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
  }

  export default APIFeatures