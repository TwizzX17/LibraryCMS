namespace LibraryCmsShared.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ImagesAddedToGenres : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Genres", "PicturePath", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Genres", "PicturePath");
        }
    }
}
