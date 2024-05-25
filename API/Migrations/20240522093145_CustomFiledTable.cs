using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class CustomFiledTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomFields_Collections_CollectionID",
                schema: "Users",
                table: "CustomFields");

            migrationBuilder.RenameColumn(
                name: "CollectionID",
                schema: "Users",
                table: "CustomFields",
                newName: "CollectionId");

            migrationBuilder.RenameIndex(
                name: "IX_CustomFields_CollectionID",
                schema: "Users",
                table: "CustomFields",
                newName: "IX_CustomFields_CollectionId");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomFields_Collections_CollectionId",
                schema: "Users",
                table: "CustomFields",
                column: "CollectionId",
                principalSchema: "Users",
                principalTable: "Collections",
                principalColumn: "CollectionId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomFields_Collections_CollectionId",
                schema: "Users",
                table: "CustomFields");

            migrationBuilder.RenameColumn(
                name: "CollectionId",
                schema: "Users",
                table: "CustomFields",
                newName: "CollectionID");

            migrationBuilder.RenameIndex(
                name: "IX_CustomFields_CollectionId",
                schema: "Users",
                table: "CustomFields",
                newName: "IX_CustomFields_CollectionID");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomFields_Collections_CollectionID",
                schema: "Users",
                table: "CustomFields",
                column: "CollectionID",
                principalSchema: "Users",
                principalTable: "Collections",
                principalColumn: "CollectionId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
