namespace LibraryCmsShared.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SeedAdded : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Books", "Resume", c => c.String(nullable: false, maxLength: 2500));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Books", "Resume", c => c.String(nullable: false, maxLength: 1000));
        }
    }
}
