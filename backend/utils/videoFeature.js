class APIFeatures {
  constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
      this.queryObj = {};
  }

  filter() {
      // Create a copy of query string and remove special fields
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
      excludedFields.forEach(el => delete queryObj[el]);
      
      // Store the cleaned query object for later use
      this.queryObj = queryObj;

      // Handle tags filtering
      if (queryObj.tags) {
          queryObj.tags = { $in: queryObj.tags.split(',') };
      }

      // Handle date ranges
      if (queryObj.dateRange) {
          try {
              const [startDate, endDate] = queryObj.dateRange.split(',');
              if (startDate && endDate) {
                  this.query = this.query.where('createdAt').gte(new Date(startDate)).lte(new Date(endDate));
              } else if (startDate) {
                  this.query = this.query.where('createdAt').gte(new Date(startDate));
              } else if (endDate) {
                  this.query = this.query.where('createdAt').lte(new Date(endDate));
              }
          } catch (error) {
              console.error('Error parsing dateRange:', error);
          }
          delete queryObj.dateRange;
      }

      // Handle view ranges
      if (queryObj.viewsRange) {
          try {
              const [minStr, maxStr] = queryObj.viewsRange.split(',');
              const min = parseInt(minStr);
              const max = parseInt(maxStr);

              if (!isNaN(min) || !isNaN(max)) {
                  if (!isNaN(min)) {
                      this.query = this.query.where('views').gte(min);
                  }
                  if (!isNaN(max)) {
                      this.query = this.query.where('views').lte(max);
                  }
              }
          } catch (error) {
              console.error('Error parsing viewsRange:', error);
          }
          delete queryObj.viewsRange;
      }

      // Handle remaining query parameters
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      const parsedQuery = JSON.parse(queryStr);
      
      // Apply remaining filters
      if (Object.keys(parsedQuery).length > 0) {
          this.query = this.query.find(parsedQuery);
      }
      
      return this;
  }

  search() {
      if (this.queryString.search) {
          const searchRegex = new RegExp(this.queryString.search, 'i');
          this.query = this.query.find({
              $or: [
                  { title: searchRegex },
                  { description: searchRegex }
              ]
          });
      }
      return this;
  }

  sort() {
      if (this.queryString.sort) {
          const sortMapping = {
              popular: '-views',
              newest: '-createdAt',
              oldest: 'createdAt',
              mostLiked: '-likes',
              leastLiked: 'likes'
          };

          const sortBy = sortMapping[this.queryString.sort] || this.queryString.sort;
          this.query = this.query.sort(sortBy);
      } else {
          this.query = this.query.sort('-createdAt');
      }
      return this;
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
      const page = Math.max(1, parseInt(this.queryString.page) || 1);
      const limit = Math.max(1, Math.min(100, parseInt(this.queryString.limit) || 12));
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
      return this;
  }
}

export default APIFeatures;