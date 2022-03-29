namespace LibraryCmsShared.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedUserCreationStamp : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "Created", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "Created");
        }
    }
}
