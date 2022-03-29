namespace LibraryCmsShared.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PasswordLengthIncreased : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Users", "Password", c => c.String(nullable: false, maxLength: 120));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Users", "Password", c => c.String(nullable: false, maxLength: 50));
        }
    }
}
